# How Coin Support Works

This document explains how blockchain (coin) support is structured in CySync. It focuses on **native coins only** — token-specific behavior is documented separately in [how-token-support-works.md](how-token-support-works.md).

After reading this, you should understand: the contract every chain implements, how each operation flows end-to-end (SDK → API → DB → UI), where shared logic lives, and how a new chain's UI plugs into `cysync-core`.

---

## 1. The big picture

CySync supports many blockchains through a **plugin-registry** pattern:

```
                           ┌──────────────────────────┐
                           │  packages/coin-support   │
                           │  (central registry)      │
                           │                          │
                           │  coinSupportMap = {      │
                           │    bitcoin:  BtcSupport, │
                           │    evm:      EvmSupport, │
                           │    solana:   SolanaSup., │
                           │    ...                   │
                           │  }                       │
                           └──────────┬───────────────┘
                                      │ getCoinSupport(familyId)
                                      ▼
                        ┌──────────────────────────────┐
                        │  CoinSupport interface       │
                        │  (coin-support-interfaces)   │
                        │                              │
                        │  ~17 methods every chain     │
                        │  must implement              │
                        └──────────────────────────────┘
                                      ▲
                                      │ implements
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
   ┌────────┴───────┐        ┌────────┴───────┐        ┌────────┴───────┐
   │ coin-support-  │        │ coin-support-  │        │ coin-support-  │
   │ btc            │        │ evm            │        │ solana ...     │
   │                │        │                │        │                │
   │ Operations     │        │ Operations     │        │ Operations     │
   │ delegate to    │        │ delegate to    │        │ delegate to    │
   │ coin-support-  │        │ coin-support-  │        │ coin-support-  │
   │ utils factories│        │ utils factories│        │ utils factories│
   └────────────────┘        └────────────────┘        └────────────────┘
```

The packages involved:

| Package | Role |
|---|---|
| [`packages/coins`](../../../packages/coins/) | Static coin metadata (IDs, names, units, derivation indices, network/chain info) |
| [`packages/coin-support-interfaces`](../../../packages/coin-support-interfaces/) | TypeScript contract every chain implements (`CoinSupport`, `IPreparedTransaction`, event types) |
| [`packages/coin-support-utils`](../../../packages/coin-support-utils/) | Shared observable factories, DB helpers, derivation utilities, price sync |
| [`packages/coin-support-{family}`](../../../packages/) | Per-chain implementation (BTC, EVM, Solana, TRON, ICP, Canton, XRP, Stellar, Near, Sia, Starknet) |
| [`packages/coin-support`](../../../packages/coin-support/) | Central registry — `coinSupportMap` + `getCoinSupport(familyId)` lookup |
| [`packages/cysync-core`](../../../packages/cysync-core/) | UI: dialogs, hooks, contexts that call into the registry via `getCoinSupport(...)` |
| [`packages/database`](../../../packages/database/) | Encrypted DB with `account`, `transaction`, `priceInfo`, `priceHistory` repos consumed by every operation |

---

## 2. The `CoinSupport` contract

Every `coin-support-{family}/src/index.ts` exports a class implementing `CoinSupport` from [packages/coin-support-interfaces/src/index.ts:46-83](../../../packages/coin-support-interfaces/src/index.ts#L46-L83). The 17 methods are grouped below by purpose.

### Account lifecycle
| Method | Returns | What it does |
|---|---|---|
| `createAccounts(params)` | `Observable<ICreateAccountEvent>` | Walks BIP-32 derivation paths, asks the device for public keys/addresses, queries the chain to find which addresses have history, persists discovered accounts. |
| `syncAccount(params)` | `Observable<void>` | Refreshes balance + transaction list for one account by paginating an indexer/API and writing rows into the DB. |
| `receive(params)` | `Observable<IReceiveEvent>` | Returns the next unused address and verifies it against the device's screen output (anti-phishing). |
| `validateAddress({ address, coinId })` | `boolean` | Synchronous address format/checksum check. |
| `formatAddress({ address, coinId })` | `string` | Display formatting (e.g. EVM checksum casing). |
| `getAccountAddress({ account })` | `Promise<string>` | Resolves a stored account into its displayable address. |
| `getAppId()` | `number` | SDK applet/app ID — used by Swap, WalletConnect, etc. to know which device app to open. |

### Transaction lifecycle (send)
| Method | Returns | What it does |
|---|---|---|
| `initializeTransaction(params)` | `Promise<IPreparedTransaction>` | Builds a skeleton `IPreparedTransaction`. Fetches **static data** that does not depend on user input — e.g. UTXOs for BTC, average gas price for EVM, nonce, reserve balance. |
| `prepareTransaction(params)` | `Promise<IPreparedTransaction>` | Recomputes **dynamic data** every time the user changes a field — coin selection, gas estimation, validation flags, final fee. |
| `signTransaction(params)` | `Observable<ISignTransactionEvent>` | Streams device interaction events (INIT → CONFIRMED → VERIFIED → CARD_TAPPED), emits the signed transaction at the end. |
| `signMessage(params)` | `Observable<ISignMessageEvent>` | Generic message signing (EVM personal_sign, EIP-712, etc.). Not implemented on chains that don't need it. |
| `broadcastTransaction(params)` | `Promise<ITransaction \| undefined>` | Posts the signed payload to a node/indexer, returns the persisted DB row. |
| `getExplorerLink({ transaction })` | `string` | Constructs the public block-explorer URL for a transaction. |

### Prices & analytics
| Method | Returns | What it does |
|---|---|---|
| `syncPrices(params)` | `Observable<void>` | Pulls current prices from CoinGecko (via Cypherock proxy) for every coin held in the DB. |
| `syncPriceHistories(params)` | `Observable<void>` | Pulls 30-day and 365-day price-history points used by portfolio charts. |
| `getCoinAllocations(params)` | `Promise<IGetCoinAllocationsResult>` | Aggregates balances across accounts; returns balance + fiat value per `(parentAssetId, assetId)`. |
| `getAccountHistory(params)` | `Promise<IGetAccountHistoryResult>` | Reconstructs balance-over-time by replaying transactions against price history; used by the per-account chart. |

A chain that does not yet implement a method (e.g. NEAR is account-discovery-only today) throws `Error('Method not implemented')` from its stub — see [packages/coin-support-near/src/index.ts:46-68](../../../packages/coin-support-near/src/index.ts).

---

## 3. The shared `IPreparedTransaction`

All send-side methods revolve around `IPreparedTransaction` defined at [packages/coin-support-interfaces/src/send.ts:10-25](../../../packages/coin-support-interfaces/src/send.ts#L10-L25):

```ts
interface IPreparedTransaction {
  validation: {
    outputs: boolean[];               // per-output validity
    hasEnoughBalance: boolean;
    isValidFee: boolean;
    ownOutputAddressNotAllowed: boolean[];
    zeroAmountNotAllowed: boolean[];
    // ...family-specific flags merged in
  };
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    isSendAll: boolean;
  };
  staticData: unknown;    // family-specific; populated once in initializeTransaction
  computedData: unknown;  // family-specific; recomputed on every prepareTransaction call
}
```

Every family extends this interface (`IPreparedBtcTransaction`, `IPreparedEvmTransaction`, etc.) and adds:

- **`userInputs`** — the inputs the user can change in the UI (fee rate for BTC, gas price/limit for EVM, destination tag for XRP, memo for Stellar/ICP/Canton).
- **`staticData`** — fetched once: average fee, UTXO set, nonce, reserve balance, etc.
- **`computedData`** — recomputed on each `prepareTransaction` call: selected UTXOs, change output, encoded calldata, final fee, gas estimate.

Reference implementations:
- [packages/coin-support-btc/src/operations/transaction.ts:25-48](../../../packages/coin-support-btc/src/operations/transaction.ts) (UTXOs + sat/vB)
- [packages/coin-support-evm/src/operations/transaction.ts:6-26](../../../packages/coin-support-evm/src/operations/transaction.ts) (gas price/limit, calldata, L1 fee)
- [packages/coin-support-xrp/src/operations/transaction.ts](../../../packages/coin-support-xrp/src/operations/transaction.ts) (destinationTag, reserves)
- [packages/coin-support-stellar/src/operations/transaction.ts](../../../packages/coin-support-stellar/src/operations/transaction.ts) (memo types, reserves)

---

## 4. Operations end-to-end

Every `coin-support-{family}` package has a `src/operations/` directory with one folder per `CoinSupport` method. The main class is a thin delegator — [packages/coin-support-btc/src/index.ts:33-107](../../../packages/coin-support-btc/src/index.ts) is the canonical shape:

```ts
class BtcSupport implements CoinSupport {
  createAccounts(params) { return operations.createAccounts(params); }
  syncAccount(params)    { return operations.syncAccount(params); }
  // ...
}
```

The interesting logic lives inside each operation folder. Most operations follow this pattern:

1. Define **coin-specific param types** extending a base interface (in `operations/types.ts`).
2. Call a **factory from `coin-support-utils`** that owns the boilerplate (observable wiring, DB writes, cancellation).
3. Pass **family-specific callbacks** — usually `createApp(connection)` (SDK app constructor), a "talk to the device" callback, and a "talk to the indexer" callback.

The next sections walk through each operation. For every operation, the structure is:

- **What it does**
- **Inputs & outputs**
- **Flow** (Device → API → DB)
- **Where UI calls it** (`cysync-core`)
- **Variations across chains**

### 4.1 createAccounts

**What it does.** Discovers all accounts (sub-wallets) for a `(wallet, coin)` pair by walking derivation schemes until it hits a threshold of empty (no-history) addresses.

**Factory.** [packages/coin-support-utils/src/createAccount/createAccount.ts:47](../../../packages/coin-support-utils/src/createAccount/createAccount.ts#L47) — `makeCreateAccountsObservable(params)`.

**Callbacks each family supplies.**

| Callback | What it does |
|---|---|
| `createApp(connection)` | Returns the SDK app instance (`BtcApp.create(connection)`, `EvmApp.create(connection)`, …) |
| `getAddressesFromDevice({ app, derivationPaths })` | Talks to the device to fetch a batch of public keys/addresses |
| `getBalanceAndTxnCount(address)` | Queries the indexer to check whether an address has history |
| `createAccountFromAddress(details)` | Maps the discovered address into an `IAccount` row |

**Flow.**

```
UI: AddAccount dialog                                   coin-support-utils
    │                                                          │
    ▼                                                          │
getCoinSupport(family).createAccounts({                        │
  connection, walletId, coinId, db                             │
})  ─────────────────────────────────────────────────────────► │
                                                               │
                                       ┌───────────────────────┘
                                       │
                                       ▼
                            For each derivation scheme:
                              1. generate next batch of paths
                              2. ask device for public keys/addresses
                              3. ask indexer: any txns at this address?
                              4. if yes  → create account, continue
                                 if no   → increment empty counter
                              5. stop when empty counter >= scheme.threshold
                                       │
                                       ▼
                            DB: account.insertOrUpdate(...)
                            Observable emits ICreateAccountEvent per account
```

**Derivation schemes.** For chains with multiple address types, schemes live in `operations/createAccounts/schemes/`. Each scheme has a name, a derivation-path generator, and a `threshold` (how many consecutive empty addresses end the scan).

- BTC: `legacy` (BIP-44), `segwit` (BIP-49), `nativeSegwit` (BIP-84), `taproot` (BIP-86) — [packages/coin-support-btc/src/operations/createAccounts/schemes/index.ts:6-48](../../../packages/coin-support-btc/src/operations/createAccounts/schemes/index.ts#L6-L48)
- EVM: `ledger` (`m/44'/60'/i'/0/0`), `metamask` (`m/44'/60'/0'/0/i`), `legacy` (`m/44'/60'/0'/i`) — [packages/coin-support-evm/src/operations/createAccounts/schemes/index.ts:5-27](../../../packages/coin-support-evm/src/operations/createAccounts/schemes/index.ts#L5-L27)
- Single-scheme chains (XRP, Stellar, Solana, …) typically use one fixed path.

**UI entry point.** [packages/cysync-core/src/dialogs/AddAccount/](../../../packages/cysync-core/src/dialogs/AddAccount/) — the user picks a coin in `SelectionDialog.tsx`, then `context/index.tsx` calls `getCoinSupport(familyId).createAccounts(...)` and subscribes to the observable to drive the progress UI.

### 4.2 syncAccount

**What it does.** Refreshes balance + transaction history for one account.

**Factory.** [packages/coin-support-utils/src/syncAccount/index.ts:11](../../../packages/coin-support-utils/src/syncAccount/index.ts#L11) — `createSyncAccountsObservable`.

**Family callbacks.** `getAddressDetails(params)` — paginates the indexer and returns `{ transactions, updatedAccountInfo, hasMore, nextIterationContext }`. The utility loops until `hasMore === false`, batching inserts/updates into the DB.

**Per-chain API endpoints.**

| Chain | Indexer API |
|---|---|
| BTC family (BTC/LTC/DOGE/DASH) | Blockbook (Cypherock-hosted) — UTXOs + txn pages |
| EVM family | Blockscout-style proxy; separate calls for native txns, internal txns, contract txns |
| Solana | RPC + Solana Indexer service |
| Tron | Tron RPC + TronScan-style endpoint |
| XRP/Stellar/Sia/ICP/Canton/Starknet/Near | Family-specific RPC or canister calls |

**UI trigger.** `packages/cysync-core/src/bgTask/accountsSync` runs continuously, looping over every account in the DB and invoking `syncAccount`. The DB `AccountRepository` is an `EventEmitter`, so any subscribed UI component re-renders when balances change.

### 4.3 receive

**What it does.** Derives the next address for an account and verifies that the device renders the same string.

**Factory.** [packages/coin-support-utils/src/receive/receive.ts:9](../../../packages/coin-support-utils/src/receive/receive.ts#L9) — `makeReceiveObservable`.

**Callbacks.** `generateReceiveAddress(account)` (chain-side derivation) and `getReceiveAddressFromDevice({ app, derivationPath })` (device call). The observable emits `'Address'` first, then `'AddressMatched'` when the device confirms.

**UI.** [packages/cysync-core/src/dialogs/Receive/](../../../packages/cysync-core/src/dialogs/Receive/). The dialog shows a spinner while the user verifies on the device. ICP needs custom logic around principal vs. account ID — see `Receive/context/index.tsx` for the conditional branch.

### 4.4 initializeTransaction & prepareTransaction

These two work as a pair:

- **`initializeTransaction`** is called once when the Send dialog opens. It fetches **all the data that doesn't depend on user input** — UTXOs (BTC/Sia), average gas price (EVM), nonce, reserve balance (XRP/Stellar). It returns an `IPreparedTransaction` with empty user inputs.
- **`prepareTransaction`** is called every time the user changes an input (recipient, amount, fee rate, send-all toggle). It re-runs validation and recomputes derived fields.

**Per-chain specifics.**

| Chain | What's in `initializeTransaction` | What's recomputed in `prepareTransaction` |
|---|---|---|
| BTC | Fetch UTXO list + average fee rate | Coin-select UTXOs, validate addresses, check dust, compute change + fee |
| EVM | Fetch average gas price | Validate recipient, estimate gas (different for native vs. contract call), encode calldata, compute final fee, account for L1 fee on L2s |
| XRP | Fetch reserveBaseBalance | Validate destination tag, check amount > XRP reserve |
| Stellar | Fetch reserve | Validate memo (length/type-specific), check amount > XLM reserve |
| Sia | Fetch UTXO list | Greedy coin-select largest-first, compute change |
| Starknet | Fetch nonce + chainId | Estimate fee_data, compute resource bounds |
| Solana | Fetch recent blockhash + rent floor | Build instructions, compute final fee |

**UI.** The Send dialog ([packages/cysync-core/src/dialogs/Send/context/index.tsx](../../../packages/cysync-core/src/dialogs/Send/context/index.tsx)) calls `initializeTransaction` on mount, stores the result in React state, and re-calls `prepareTransaction` (debounced) every time a controlled input fires `onChange`. The validation flags it returns drive inline error messages and the "Continue" button's disabled state.

### 4.5 signTransaction

**What it does.** Streams the device-signing flow and returns the signed payload.

**Factory.** [packages/coin-support-utils/src/signTransaction/index.ts:35](../../../packages/coin-support-utils/src/signTransaction/index.ts#L35) — `makeSignTransactionsObservable`.

**Callbacks.**

- `createApp(connection)` — SDK app constructor.
- `mapPreparedTxnToSdkTxn(transaction)` — converts the family's `IPreparedTransaction` into the binary structure the SDK expects.
- `signTransactionFromDevice({ app, sdkTxn, account, coin })` — calls the SDK's `signTxn` (or equivalent) method.

**Device events.** The observable emits `SignTransactionDeviceEvent` values defined at [packages/coin-support-interfaces/src/send.ts:40-46](../../../packages/coin-support-interfaces/src/send.ts#L40-L46): `INIT`, `CONFIRMED`, `VERIFIED`, `PASSPHRASE_ENTERED`, `CARD_TAPPED`. The UI binds these to checkmark icons on the signing screen.

**UI.** [packages/cysync-core/src/dialogs/Send/Dialogs/SignDialog.tsx](../../../packages/cysync-core/src/dialogs/Send/Dialogs/SignDialog.tsx) subscribes to the observable and drives a stepper.

### 4.6 broadcastTransaction

**What it does.** Posts the signed payload to a node/indexer, then inserts the resulting transaction row into the DB so the UI immediately shows the new send.

**Implementation.** Each family has a `services/broadcast.ts` (or similar) that wraps a POST to the Cypherock-hosted node/proxy. The operation file maps the response to an `ITransaction` row and inserts it via `insertOrUpdateTransactions` from `coin-support-utils`.

**UI.** Called from `Send/context/index.tsx` immediately after `signTransaction` completes; the dialog then transitions to its "broadcast success" screen.

### 4.7 syncPrices & syncPriceHistories

**Factories.**
- [packages/coin-support-utils/src/syncPrices/index.ts:38](../../../packages/coin-support-utils/src/syncPrices/index.ts#L38) — `createSyncPricesObservable`
- [packages/coin-support-utils/src/syncPriceHistories/index.ts:80](../../../packages/coin-support-utils/src/syncPriceHistories/index.ts#L80) — `createSyncPriceHistoriesObservable`

**Callbacks.** Each family supplies `getCoinIds(db)` — typically just `db.account.getAll({ familyId }).map(a => ({ assetId, parentAssetId }))`. The utility batches up to 20 coins per request to the Cypherock CoinGecko proxy, caches results, and writes `priceInfo` / `priceHistory` rows.

**TTL.** 60 seconds for current prices; 30-day and 365-day histories refresh on a longer interval.

**UI trigger.** `packages/cysync-core/src/bgTask/pricesSync` runs on app start and on an interval.

### 4.8 getCoinAllocations & getAccountHistory

These compute portfolio data from DB rows without any device or network calls.

- **`getCoinAllocations`** — [packages/coin-support-utils/src/getCoinAllocations/index.ts:12](../../../packages/coin-support-utils/src/getCoinAllocations/index.ts#L12). Sums balances across all accounts for the given `(parentAssetId, assetId)`, converts to the default unit, multiplies by the latest price.
- **`getAccountHistory`** — [packages/coin-support-utils/src/getAccountHistory/index.ts:317](../../../packages/coin-support-utils/src/getAccountHistory/index.ts#L317). Replays transactions backwards against the price-history timeline to reconstruct the balance-over-time line on the per-account chart.

**UI.** Portfolio page and per-account chart components in `packages/cysync-core/src/pages/MainApp/`.

### 4.9 validateAddress, formatAddress, getAccountAddress, getExplorerLink

These are pure synchronous helpers — no device, no DB, no network. They appear in every family but the implementations are tiny.

- `validateAddress` — usually `multicoin-address-validator` for BTC/EVM, custom regex/checksum for others.
- `formatAddress` — EVM does `ethers.getAddress(...)`; most others return the input untouched.
- `getAccountAddress` — typically `account.xpubOrAddress`; ICP derives a principal from the stored public key.
- `getExplorerLink` — string concat returning a Cypherock-proxy URL or a chain-explorer URL.

---

## 5. Cross-cutting building blocks

### 5.1 `coin-support-utils` shared utilities

Beyond the observable factories above, [`coin-support-utils`](../../../packages/coin-support-utils/) provides:

- **`db/account.ts`** — `getAccountAndCoin`, `insertOrUpdateAccounts`, `hideAccount`, etc.
- **`db/transaction.ts`** — `createTransactionId` (deterministic SHA-256 over identifying fields), batched `insertOrUpdateTransactions` (BATCH_SIZE=100, 500 ms gap).
- **`db/price.ts`** — `getCoinPrice` (returns `'0'` on miss).
- **`db/coin.ts`** — `getAsset` / `getAssetOrUndefined` resolve a coin or token by ID.
- **`unit.ts`** — `getUnit`, `getDefaultUnit`, `convertToUnit`, `formatDisplayAmount`, `formatDisplayPrice`.
- **`common/index.ts`** — `mapDerivationPath` converts `m/44'/0'/0'/0/0` strings into the numeric array the SDK expects.
- **`services/`** — `getLatestPrices`, `getPriceHistory` (CoinGecko proxy wrappers).

### 5.2 Per-package layout

Almost every `coin-support-{family}` package has the same shape:

```
packages/coin-support-{family}/
├── src/
│   ├── index.ts              # Main class implementing CoinSupport
│   ├── config.ts             # API base URLs
│   ├── utils/
│   │   ├── app.ts            # SDK app factory (createApp / getAppletId)
│   │   ├── logger.ts         # scoped logger + updateLogger
│   │   └── getCoinIds.ts     # used by syncPrices / getCoinAllocations
│   ├── services/             # axios wrappers over external APIs
│   │   ├── fees.ts
│   │   ├── broadcast.ts
│   │   └── api/...           # indexer endpoints (history, balance, utxos, ...)
│   └── operations/
│       ├── index.ts          # barrel
│       ├── types.ts          # family-specific param types
│       ├── transaction.ts    # IPreparedXxxTransaction extension
│       ├── createAccounts/
│       │   ├── index.ts
│       │   └── schemes/      # derivation schemes (if multi-scheme)
│       ├── syncAccount/
│       ├── receive/
│       ├── initializeTransaction/
│       ├── prepareTransaction/
│       ├── signTransaction/
│       ├── broadcastTransaction/
│       ├── validateAddress/
│       ├── syncPrices/
│       ├── syncPriceHistories/
│       ├── getCoinAllocations/
│       ├── getAccountHistory/
│       └── getExplorerLink/
└── tests/                    # one test file per operation + __mocks__ + __fixtures__
```

### 5.3 SDK integration

Each chain has a corresponding SDK app under `@cypherock/sdk-app-{family}`. Two helpers live in `src/utils/app.ts`:

```ts
export const createApp = (connection: IDeviceConnection) =>
  BtcApp.create(connection);              // SDK app constructor

export const getAppletId = () => BtcApp.appletId;
```

`createApp` is the callback most operation factories receive; `getAppletId` is consumed by [`cysync-core/src/pages/MainApp/Swap/...`](../../../packages/cysync-core/src/pages/MainApp/Swap/) and other features that need to know which device app to open.

Some chains expose a static **library-injection** method to keep the heavy crypto library outside the bundled SDK:

- `BtcSupport.setBitcoinLibrary(bitcoinjsLib)` — [packages/coin-support-btc/src/index.ts:33-107](../../../packages/coin-support-btc/src/index.ts)
- `EvmSupport.setEthersLibrary(ethers)`, `setEip712Library(...)`, `setWeb3Library(...)` — [packages/coin-support-evm/src/index.ts:44-135](../../../packages/coin-support-evm/src/index.ts)

These must be called from app bootstrap before the first device interaction.

---

## 6. Coin metadata (the `coins` package)

Every chain registers static metadata in [packages/coins/src/{family}/](../../../packages/coins/src/):

```
packages/coins/src/{family}/
├── coins.ts     # raw array of coin definitions
└── index.ts     # types, ID map, family interface, exported coin list
```

`coins.ts` entries always carry:

```ts
id           // unique slug, e.g. 'bitcoin', 'ethereum'
abbr         // ticker, e.g. 'BTC', 'ETH'
name         // display name
isTest       // testnet flag
coinGeckoId  // CoinGecko slug for price lookup
coinIndex    // BIP-44 coin type, hex string (e.g. '80000000')
feesUnit     // label shown in the UI ('sat/byte', 'Gwei', …)
color        // hex colour for charts/UI accents
units        // [{ name, abbr, magnitude }] denominations
```

Family-specific fields are added on top:

| Family | Extra fields |
|---|---|
| BTC | `apiCoinType` (`'btc'`, `'ltc'`, …) |
| EVM | `chain` (numeric chainId), `network` (`'main'`, `'polygon'`, …), `tokens`, `tokensByContract` |
| Solana | `network`, `curve` (`'ed25519'`), `tokens`, `tokensByContract` |
| XRP | `network` |
| Stellar | `network` |
| Starknet | `network`, `argentXClassHash` |
| ICP | `network`, `tokens`, `tokensByContract` |
| Canton | `network`, `decimals`, `instrument`, `tokens`, `tokensByContract` |
| Near | `network`, `curve`, `isUnderDevelopment` |
| Sia | `network` |
| Tron | `tokens`, `tokensByContract`, `isUnderDevelopment` |

Three cross-family files tie everything together:

- [packages/coins/src/types.ts:7-19](../../../packages/coins/src/types.ts#L7-L19) — `coinFamiliesMap` enumerating every supported family.
- [packages/coins/src/aggregate.ts](../../../packages/coins/src/aggregate.ts) — merges every family's coin list into one `coinList` record and a `CoinTypes` union.
- [packages/coins/src/index.ts](../../../packages/coins/src/index.ts) — barrel exports.

The **`assetId` format** (used everywhere as the unique identifier for a coin or token in the DB) is just the coin ID for native coins — e.g. `bitcoin`, `ethereum`. The token form is covered in [how-token-support-works.md](how-token-support-works.md).

---

## 7. The central registry

[packages/coin-support/src/index.ts:15-37](../../../packages/coin-support/src/index.ts#L15-L37):

```ts
const coinSupportMap: Record<CoinFamily, CoinSupport> = {
  [coinFamiliesMap.bitcoin]: new BtcSupport(),
  [coinFamiliesMap.evm]:     new EvmSupport(),
  [coinFamiliesMap.solana]:  new SolanaSupport(),
  // ...one entry per family
};

export const getCoinSupport = (familyId: CoinFamily): CoinSupport =>
  coinSupportMap[familyId];
```

`cysync-core` never imports a `coin-support-{family}` package directly. Every call site looks like:

```ts
const support = getCoinSupport(account.familyId);
const observable = support.signTransaction({ ... });
```

This is what makes the system extensible — adding a chain means registering one new entry here.

---

## 8. UI integration in `cysync-core`

Even though the registry is the only "runtime" coupling, the UI needs many family-specific files because each chain has unique fields (memo, destination tag, expiration date, deploy-account button, …). Below is the checklist of places `cysync-core` currently branches on coin family. **This is the canonical list of files you'll touch when adding UI for a new chain.**

### 8.1 Icons (always)

- [packages/cysync-core/src/components/CoinIcon.tsx:61-81](../../../packages/cysync-core/src/components/CoinIcon.tsx#L61-L81) — `coinToIconMap: Record<assetId, IconComponent>`.

The icon component itself must first exist in [`packages/ui`](../../../packages/ui/).

### 8.2 Send dialog (always, if the coin can send)

Several `Record<CoinFamily, ...>` maps in [packages/cysync-core/src/dialogs/Send/](../../../packages/cysync-core/src/dialogs/Send/) — every family **must have an entry in every map** (use a no-op for features the family doesn't need).

| File | Map | Purpose |
|---|---|---|
| `Dialogs/Components/FeeSection/index.tsx:48-54` | `feeInputMap` | Fee input component (reuse existing if structure matches) |
| `Dialogs/Components/FeeSection/index.tsx:62-69` | `feeHeaderMap` | Custom fee header (most use `FeesHeader`; Optimism has its own) |
| `Dialogs/Components/FeeSection/index.tsx:240-252` | `feeInputPropsMap` | Maps `IPreparedTransaction` → props for the input component |
| `Dialogs/Components/AddressAndAmountSection/index.tsx:178-190` | `anaInputMap` | Recipient/amount input component |
| `Dialogs/Components/AddressAndAmountSection/SingleTransaction.tsx:155-157` | `destinationTagInputMap` | Destination tag (XRP only) |
| `SingleTransaction.tsx:224-226` | `expirationDateInputMap` | Expiration date (Canton only) |
| `SingleTransaction.tsx:280-292` | `memoInputPropsMap` | Memo input props |
| `SingleTransaction.tsx:294-298` | `memoInputMap` | Memo input component (ICP/Stellar/Canton) |
| `context/index.tsx:906-921` | `computedFeeMap` | Extracts fee string from the family's `IPreparedTransaction` |
| `hooks/useLabelSuffix.ts:14-26` | `labelSuffixMap` | Short tag shown next to coin names (e.g. "L1") |

Plus conditional branches in:

- `Dialogs/SummaryDialog.tsx` — long-address wrapping (Sia at line 97), fee suppression (Canton at line 187), memo details (ICP ~290, Stellar ~304, Canton ~346), expiration (Canton ~360).
- `context/index.tsx:926-948` — `fillExtraInput()` for destination tags and memos.

### 8.3 Receive dialog (conditional)

- `dialogs/Receive/context/index.tsx` — ICP has principal-vs-account-ID handling. Most chains don't need changes here.

### 8.4 Add account / Account page

- [`dialogs/AddAccount/Dialogs/SelectionDialog.tsx:24-46`](../../../packages/cysync-core/src/dialogs/AddAccount/Dialogs/SelectionDialog.tsx#L24-L46) — `getCoinDropDownList()` filters which coins appear (firmware capability, vendor restrictions).
- [`dialogs/AddAccount/context/index.tsx`](../../../packages/cysync-core/src/dialogs/AddAccount/context/index.tsx) — branch here if your chain needs a non-standard account creation flow (e.g. Canton's email login, Starknet's deploy-account step).
- [`pages/MainApp/Account/index.tsx:115-172`](../../../packages/cysync-core/src/pages/MainApp/Account/index.tsx#L115-L172) — chain-specific action buttons (Canton: Enable Approval / Merge Delegation / Resync).

### 8.5 History dialog (conditional)

- [`dialogs/HistoryDialog.tsx:120-128`](../../../packages/cysync-core/src/dialogs/HistoryDialog.tsx#L120-L128) — `getTransactionHashText()` picks the right field name (ICP uses `transactionId`, Canton uses `transactionUpdateId`).
- Explorer links go through `getCoinSupport(familyId).getExplorerLink(tx)` — no UI change required for that part.

### 8.6 Hooks (conditional)

- [`hooks/useDisplayTransactions.tsx:261-267`](../../../packages/cysync-core/src/hooks/useDisplayTransactions.tsx#L261-L267) — chain-specific fee/account branching (only needed for unusual fee-from-different-account patterns).
- [`hooks/useAssetAllocations.tsx`](../../../packages/cysync-core/src/hooks/useAssetAllocations.tsx) — firmware capability checks.

### 8.7 WalletConnect (optional)

- [`context/walletConnect/versions/v1.ts:111-114`](../../../packages/cysync-core/src/context/walletConnect/versions/v1.ts#L111-L114) — currently EVM-only. Add a branch if WalletConnect should support your chain.

### 8.8 Background tasks

You normally don't touch these — they just call `getCoinSupport(family).{syncAccount,syncPrices,syncPriceHistories}` for every account/family in the DB. They live under [`packages/cysync-core/src/bgTask/`](../../../packages/cysync-core/src/bgTask/).

---

## 9. End-to-end example: a BTC send

To tie it all together, here's the full path of a BTC send from "user opens dialog" to "transaction in history":

```
User clicks Send on a BTC account
   │
   ▼
SendDialog mounts → context calls
   getCoinSupport('bitcoin').initializeTransaction({ accountId, db })
     │
     ▼
   coin-support-btc/src/operations/initializeTransaction/index.ts
     ├─ services/blockbook/api/utxos.ts        → fetch UTXOs (axios POST)
     ├─ services/fees.ts                       → fetch averageFee  (axios POST)
     └─ returns IPreparedBtcTransaction{
            userInputs:  { outputs:[], feeRate, isSendAll:false },
            staticData:  { utxos[], averageFee },
            computedData:{ inputs:[], outputs:[], fee:'0' },
            validation:  {...}
        }
   │
User types recipient + amount
   ▼
context (debounced) → getCoinSupport('bitcoin').prepareTransaction({
        accountId, db, transaction
   })
     │
     ▼
   coin-support-btc/.../prepareTransaction/index.ts
     ├─ validate recipient address
     ├─ coin-select UTXOs to cover (amount + estimated fee)
     ├─ compute change output, dust check
     └─ return updated IPreparedBtcTransaction (validation flags + computedData)
   │
User clicks "Continue" → SignDialog mounts
   ▼
context → getCoinSupport('bitcoin').signTransaction({
        db, connection, transaction
   })
     │
     ▼
   coin-support-btc/.../signTransaction/index.ts
     ├─ makeSignTransactionsObservable from coin-support-utils
     ├─ createApp(connection) → BtcApp
     ├─ mapPreparedTxnToSdkTxn() → SDK binary form
     └─ signTransactionFromDevice() drives device interaction
                                    emits INIT → CONFIRMED → VERIFIED → CARD_TAPPED
   │
Signed payload returned
   ▼
context → getCoinSupport('bitcoin').broadcastTransaction({
        db, transaction, signedTransaction
   })
     │
     ▼
   coin-support-btc/src/services/broadcast.ts → POST /transaction/broadcast
     ├─ on success: map response to ITransaction
     └─ insertOrUpdateTransactions(db, [tx])
   │
   ▼
TransactionRepository emits 'updated' → React subscribers re-render →
new transaction appears in the History dialog.
```

Every coin family follows the same shape — only the contents of `staticData`, `computedData`, the SDK calls, and the API endpoints differ.
