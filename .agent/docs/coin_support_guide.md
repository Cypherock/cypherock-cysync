# Coin Support Guide

Step-by-step guide for adding a new blockchain/coin family to CySync. Follow the existing pattern established by BTC, EVM, Solana, and other implementations.

## Overview

Adding a new coin requires changes across 3 packages, with the main work in a new `coin-support-{family}` package:

1. `**packages/coins/src/{family}/**` — Coin metadata (IDs, names, units, colors)
2. `**packages/coin-support-{family}/**` — Implementation of the `CoinSupport` interface
3. `**packages/coin-support/**` — Registration in the central registry

## Step 1: Define Coin Metadata

### 1a. Create coin family directory

Create `packages/coins/src/{family}/` with two files.

`**coins.ts**` — Array of coin definitions. Reference `packages/coins/src/btc/coins.ts` for the simplest example:

```
Required fields per coin:
  id           unique string identifier (e.g., 'bitcoin', 'ethereum')
  abbr         ticker symbol (e.g., 'BTC', 'ETH')
  name         display name
  isTest       boolean, true for testnets
  coinGeckoId  CoinGecko API identifier for price data
  coinIndex    BIP44 coin type as hex string (e.g., '80000000' for BTC)
  feesUnit     fee denomination label (e.g., 'sat/byte', 'Gwei')
  color        hex color for UI (e.g., '#f9a43f')
  units        array of { name, abbr, magnitude } denominations
```

Family-specific fields can be added (e.g., BTC has `apiCoinType`, EVM has `chain` and `network`).

`**index.ts**` — Exports the coin info interface, ID map, and aggregated coin list. Reference patterns:

- Simple (no tokens): `packages/coins/src/btc/index.ts`
- With tokens: `packages/coins/src/evm/index.ts` — includes `IEvmErc20Token`, `getErc20Tokens()`

Key pattern from `packages/coins/src/btc/index.ts`:

- Extend `ICoinInfo` with family-specific fields → `IBtcCoinInfo`
- Create an ID map const → `BtcIdMap`
- Export a typed coin list → `btcCoinList: Record<string, IBtcCoinInfo>`

### 1b. Register in coins aggregate

`**packages/coins/src/aggregate.ts`:**

- Import your coin list and ID type
- Add to the `coinList` record (line ~26-37)
- Add ID type to `CoinTypes` union (line ~40-50)

`**packages/coins/src/types.ts`:**

- Add family key to `coinFamiliesMap` (line 7-19)

`**packages/coins/src/index.ts`:**

- Add `export * from './{family}'`

### 1c. Token support (if applicable)

For chains with tokens (ERC-20, SPL, TRC-20, etc.), create a `token.ts` in the family directory. Reference `packages/coins/src/evm/token.ts` for the pattern:

- Define token interface extending `ICoinInfo` with `parentId`, `address`
- Asset ID format: `{parentAssetId}:{tokenAssetId}`
- Token lists are typically JSON files loaded at build time

## Step 2: Create Coin Support Package

### 2a. Package scaffold

Create `packages/coin-support-{family}/` with:

```
coin-support-{family}/
├── src/
│   ├── index.ts              Main class implementing CoinSupport
│   ├── config.ts             API endpoint configuration
│   ├── utils/
│   │   ├── index.ts
│   │   ├── app.ts            SDK app factory + applet ID
│   │   ├── logger.ts         Scoped logger instance
│   │   └── getCoinIds.ts     Coin ID utility (if needed)
│   ├── services/
│   │   ├── index.ts
│   │   ├── fees.ts           Fee estimation API
│   │   └── broadcast.ts      Transaction broadcast API
│   └── operations/
│       ├── index.ts           Re-exports all operations
│       ├── types.ts           Coin-specific param types extending base interfaces
│       ├── transaction.ts     IPreparedTransaction extension for this coin
│       ├── createAccounts/
│       ├── receive/
│       ├── syncAccount/
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
├── tests/
├── package.json
├── tsconfig.json
└── jest.config.js
```

### 2b. package.json dependencies

Required workspace dependencies:

```json
"@cypherock/coin-support-interfaces": "workspace:^",
"@cypherock/coin-support-utils": "workspace:^",
"@cypherock/coins": "workspace:^",
"@cypherock/db-interfaces": "workspace:^",
"@cypherock/sdk-app-{family}": "^x.x.x",
"@cypherock/sdk-interfaces": "^x.x.x",
"@cypherock/sdk-utils": "^x.x.x",
"axios": "^1.4.0",
"rxjs": "^7.8.1"
```

Plus any chain-specific SDK (e.g., `bitcoinjs-lib`, `ethers`, `@solana/web3.js`).

Copy `tsconfig.json` and `jest.config.js` from an existing coin-support package.

### 2c. SDK integration (`src/utils/app.ts`)

Reference `packages/coin-support-btc/src/utils/app.ts`:

- Import the SDK app class for your chain
- Export `createApp(connection: IDeviceConnection)` factory
- Export `getAppletId()` returning the app's ID

### 2d. Main class (`src/index.ts`)

Reference `packages/coin-support-btc/src/index.ts:33-107`:

- Class implements `CoinSupport` from `@cypherock/coin-support-interfaces`
- Each method delegates to corresponding `operations.*` function
- Static method for library initialization if needed (e.g., `setBitcoinLibrary`)
- Export types, services, and `updateLogger`
- Unimplemented methods throw `Error('Method not implemented')`

### 2e. Operations

Each operation lives in its own directory under `src/operations/`. The general pattern:

1. Define coin-specific params extending base interface (in `types.ts`)
2. Implement the operation, typically using a factory from `coin-support-utils`
3. Export from `operations/index.ts`

**Key operation patterns:**

**createAccounts** — Uses `createAccountFromAddress()` utility from coin-support-utils:

- Provide `getAddressesFromDevice()` callback (SDK calls)
- Provide `getBalanceAndTxnCount()` callback (API calls)
- Reference: `packages/coin-support-utils/src/createAccount/createAccount.ts:47-120`

**signTransaction** — Uses `makeSignTransactionsObservable()`:

- Define `mapPreparedTxnToSdkTxn()` — converts prepared transaction to SDK format
- Define `signTransactionFromDevice()` — calls SDK app method
- Reference: `packages/coin-support-btc/src/operations/signTransaction/index.ts`

**syncAccount / syncPrices / syncPriceHistories** — Return `Observable<void>`:

- Use shared sync utilities from coin-support-utils
- Fetch data from external APIs, update database

**initializeTransaction** — Returns `Promise<IPreparedTransaction>`:

- Fetch static data (fees, UTXOs, nonce, etc.)
- Create coin-specific prepared transaction object

**prepareTransaction** — Returns updated `IPreparedTransaction`:

- Recompute dynamic fields based on user input changes

### 2f. Transaction model (`src/operations/transaction.ts`)

Extend `IPreparedTransaction` from `packages/coin-support-interfaces/src/send.ts` with coin-specific fields:

- `userInputs` — coin-specific user inputs (feeRate for BTC, gasPrice/gasLimit for EVM)
- `staticData` — data fetched once during initialization (UTXOs, average fee, nonce)
- `computedData` — derived data recalculated on each prepare call

Reference implementations:

- BTC: `packages/coin-support-btc/src/operations/transaction.ts`
- EVM: `packages/coin-support-evm/src/operations/transaction.ts`
- Solana: `packages/coin-support-solana/src/operations/transaction.ts`

### 2g. Derivation schemes (if applicable)

For UTXO-based or multi-derivation chains, create `src/operations/createAccounts/schemes/`:

- Define scheme map and interface
- Reference: `packages/coin-support-btc/src/operations/createAccounts/schemes/types.ts`

## Step 3: UI Integration in cysync-core

The `packages/cysync-core/` package contains all coin-specific UI logic. When adding a new coin family, several files need updating.

### 3a. Coin icon mapping (mandatory)

**File:** `packages/cysync-core/src/components/CoinIcon.tsx:61-81`

Add your coin's icon to the `coinToIconMap` record. The icon component must first exist in the UI package (`@cypherock/cysync-ui`).

```
[NewCoinIdMap.newcoin]: NewCoinIcon,
```

If your coin has tokens with dedicated icons, also add entries to `TokenToIconMap` (line 83-87).

### 3b. Send dialog — fee input components (mandatory if coin supports send)

**File:** `packages/cysync-core/src/dialogs/Send/Dialogs/Components/FeeSection/index.tsx`

Three maps need updating:
- `feeInputMap` (line 48-54) — maps coin family to a fee input React component. Reuse existing ones if fee structure is similar (e.g., Stellar reuses `XrpInput`)
- `feeHeaderMap` (line 61-69) — maps coin family to fee header component
- `feeInputPropsMap` (line ~240-252) — maps coin family to a function returning fee props from `IPreparedTransaction`

If no existing fee component fits, create a new one in `FeeSection/` following the pattern in `BitcoinInput.tsx` or `EthereumInput.tsx`.

### 3c. Send dialog — extra transaction fields (conditional)

**File:** `packages/cysync-core/src/dialogs/Send/Dialogs/Components/AddressAndAmountSection/SingleTransaction.tsx`

Three optional field types, each with a props map and a component map:

- **Destination tag** (line 138-157) — e.g., XRP uses `DestinationTagInput`. Add to `destinationTagInputPropsMap` (all families must have an entry, use `() => ({})` for no-op) and `destinationTagInputMap`
- **Expiration date** (line ~220-226) — e.g., Canton uses `CantonTransactionExpiryInput`. Add to `expirationDateInputPropsMap` and `expirationDateInputMap`
- **Memo** (line 280-298) — e.g., ICP, Stellar, Canton each have custom memo inputs. Add to `memoInputPropsMap` and `memoInputMap`

When adding a new coin family, you must add an entry to every `*PropsMap` record (they are `Record<CoinFamily, ...>` so all families are required).

### 3d. Send dialog — summary display (conditional)

**File:** `packages/cysync-core/src/dialogs/Send/Dialogs/SummaryDialog.tsx`

If your coin has special address formatting, memo fields, or unique fee display, add conditional logic here. Reference how Canton handles memo (line ~290-355) and fee exclusion (line ~187).

### 3e. Send dialog — context/fee computation (conditional)

**File:** `packages/cysync-core/src/dialogs/Send/context/index.tsx`

- `getComputedFee()` (line ~923-939) — add case if your coin computes fees differently (XRP, Stellar have special cases)
- Coin-specific validation or flow logic (e.g., ICP memo validation at line ~968, Starknet account validation at line ~1212)

### 3f. Add account dialog — coin selection filtering (review)

**File:** `packages/cysync-core/src/dialogs/AddAccount/Dialogs/SelectionDialog.tsx:24-46`

Review `getCoinDropDownList()` to see if your coin should be excluded under certain conditions (BTC-only firmware, vendor-specific filtering). If your coin requires a special account creation flow (like Canton's email login), modify `packages/cysync-core/src/dialogs/AddAccount/context/index.tsx`.

### 3g. Add token dialog (if coin supports tokens)

**File:** `packages/cysync-core/src/dialogs/AddToken/context/index.tsx:159-181`

If your coin family supports tokens:
- Import the token coin list from `@cypherock/coins`
- Add to the concatenated token array (line 164-169)
- Handle special token data in `extraData` if needed (line ~302-305, see ICP/Canton pattern)

### 3h. Transaction history (conditional)

**File:** `packages/cysync-core/src/dialogs/HistoryDialog.tsx`

If your coin needs custom transaction display, explorer link handling, or hash formatting, add conditional logic here (reference Canton exclusions at line ~287, ~398).

### 3i. Hooks (conditional)

- `packages/cysync-core/src/hooks/useDisplayTransactions.tsx` — if your coin has unique fee account logic (see ICP pattern at line ~261-271)
- `packages/cysync-core/src/hooks/useAssetAllocations.tsx` — if firmware capability checks are needed

### 3j. WalletConnect support (optional)

**File:** `packages/cysync-core/src/context/walletConnect/type.ts:1`

If your coin should support WalletConnect, add it to the `supportedWalletConnectFamilies` array.

## Step 4: Register in Central Registry

### 4a. Update `packages/coin-support/src/index.ts`

- Add import: `import { NewCoinSupport } from '@cypherock/coin-support-{family}'`
- Add to `coinSupportMap`: `[coinFamiliesMap.{family}]: new NewCoinSupport()`

### 4b. Update `packages/coin-support/package.json`

- Add dependency: `"@cypherock/coin-support-{family}": "workspace:^"`

## Step 5: Library Initialization (if needed)

If your coin's SDK requires runtime library initialization (like BTC requires bitcoinjs-lib), add initialization calls to:

- **Desktop:** Check `apps/desktop/` for where other coin libraries are initialized
- **CLI:** `apps/cli/src/utils/baseCommand.ts:75-90` — add to the init sequence

## Step 6: Verification Checklist

**Coin metadata (packages/coins/):**
- `src/types.ts` — family added to `coinFamiliesMap`
- `src/{family}/coins.ts` — coin definitions with all required fields
- `src/{family}/index.ts` — typed coin list, ID map, and coin info interface
- `src/aggregate.ts` — coin list and type union updated
- `src/index.ts` — re-export added

**Coin support package (packages/coin-support-{family}/):**
- Package created with operations, services, utils
- `src/index.ts` — implements `CoinSupport` interface

**Registry (packages/coin-support/):**
- `src/index.ts` — registered in `coinSupportMap`
- `package.json` — dependency added

**UI integration (packages/cysync-core/):**
- `src/components/CoinIcon.tsx` — icon mapping added
- `src/dialogs/Send/.../FeeSection/index.tsx` — fee input/header/props maps updated
- `src/dialogs/Send/.../SingleTransaction.tsx` — all `*PropsMap` records have entry for new family
- `src/dialogs/AddToken/context/index.tsx` — token list added (if applicable)
- Other conditional files reviewed per Step 3

**Build:**
- `pnpm install` succeeds
- `pnpm build` succeeds
- Tests pass for new package

