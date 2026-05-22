# Adding a New Coin Family

Use this guide when the chain you're adding **doesn't fit any existing family** — e.g. a new L1 with a unique transaction model, derivation, or account structure. If the new chain is just another EVM/UTXO/etc. instance, follow [adding-new-coin-support-to-existing-family.md](adding-new-coin-support-to-existing-family.md) instead.

> **Prerequisites.** Read [how-coin-support-works.md](how-coin-support-works.md) end-to-end first. It defines the `CoinSupport` contract, `IPreparedTransaction`, the per-package layout, the registry, and the full UI integration map. This guide only names the **work items**; mechanics are in that doc.

The mechanical scaffolding is done by [`scripts/addCoinFamily.js`](../../../scripts/addCoinFamily.js). What's left after running it is the chain-specific logic — SDK wiring, operation implementations, UI customisations.

---

## Decision checklist before you start

Answer these up-front; they shape Step 2 onwards.

| Question | Why it matters |
|---|---|
| Address format? | Determines `validateAddress` / `formatAddress` |
| UTXO-based or account-based? | UTXO needs coin selection; account-based needs nonce management |
| BIP-44 coin type? | Goes into `coinIndex` (8 hex chars, asked by the script) |
| Multiple derivation schemes? | If yes, you'll add `operations/createAccounts/schemes/` after scaffold |
| Extra user inputs (memo, destination tag, expiration, …)? | Affects `IPreparedTransaction.userInputs` + Send dialog |
| Account activation / reserve required? | Adds validation flags |
| SDK app exists? | If not, coordinate with SDK team — script writes a stub `app.ts` |
| Indexer/API? | Cypherock-hosted proxy or public RPC |
| Heavy crypto library to inject? | Add a `set{Lib}Library` static method (BTC/EVM pattern) |
| Tokens later? | Ship native-only first, then follow [adding-token-support-to-coin.md](adding-token-support-to-coin.md) |

Pick a short lowercase family name (e.g. `cosmos`, `aptos`) — it becomes a directory name and a string literal everywhere.

---

## Step 1 — Run the scaffold script

```bash
pnpm scaffold:coin-family
# (or: node scripts/addCoinFamily.js)
```

The script prompts for the family name and the first coin's metadata (id, abbr, name, coinGeckoId, coinIndex, color, network, magnitude, sub-unit), then in one pass:

- Creates `packages/coins/src/{family}/{coins,index}.ts`.
- Registers the family in `packages/coins/src/{types,aggregate,index}.ts`.
- Generates the full `packages/coin-support-{family}/` package skeleton:
  - `package.json`, `tsconfig.json`, `tsconfig_cjs.json`, `tsconfig.eslint.json`, `jest.config.js`, `.eslintrc.js`, `.gitignore`, `.prettierrc`, `README.md`
  - `src/config.ts`, `src/utils/{app,logger,getCoinIds,index}.ts`, `src/services/index.ts`
  - One stub `operations/{op}/index.ts` per `CoinSupport` method, plus `operations/{index,types,transaction}.ts`
  - `src/index.ts` — the main class implementing `CoinSupport`, every method throwing `'Method not implemented'`
  - A minimal `tests/{family}.test.ts`
- Registers the family in `packages/coin-support/{src/index.ts,package.json}`.
- Inserts no-op entries into the four required `Record<CoinFamily, ...>` maps in `cysync-core`:
  - `feeInputPropsMap` → `() => ({})`
  - `computedFeeMap` → `() => '0'`
  - `labelSuffixMap` → `getDefaultSuffix`
  - `anaInputMap` → a new `{Family}AddressAndAmount` component (same single-transaction shape as the other 11)

**Read the SHORTCOMINGS block at the top of `scripts/addCoinFamily.js` before continuing** — it lists what the script deliberately does *not* do and is the authoritative list of what you still have to wire up by hand.

```bash
pnpm install        # picks up the new workspace package
pnpm build          # should pass; every operation throws at runtime
```

---

## Step 2 — Fill in the scaffolded `coin-support-{family}` package

The script left every operation as a stub. The implementation work is essentially everything in [how-coin-support-works.md §4](how-coin-support-works.md#4-operations-end-to-end). Specifically:

### 2.1 SDK app integration

`src/utils/app.ts` is a throw-stub. Once `@cypherock/sdk-app-{family}` exists:

1. Add it to `package.json` dependencies.
2. Replace the stub with `createApp(connection)` and `getAppletId()` calls into the real SDK app. Reference: [packages/coin-support-btc/src/utils/app.ts](../../../packages/coin-support-btc/src/utils/app.ts).
3. If your chain needs a heavy injected crypto library (BTC/EVM pattern), add a `static set{Lib}Library` method to the main class in `src/index.ts` and wire it into `apps/desktop` and `apps/cli` bootstraps. Grep for `setBitcoinLibrary` / `setEthersLibrary` to find the call sites.

### 2.2 Transaction model

`src/operations/transaction.ts` is currently `type IPrepared{Family}Transaction = IPreparedTransaction`. Extend it with chain-specific `userInputs` / `staticData` / `computedData` / validation flags. Background and reference impls in [how-coin-support-works.md §3](how-coin-support-works.md#3-the-shared-ipreparedtransaction).

### 2.3 Operations

Implement each `operations/{op}/index.ts` by calling the relevant factory from `@cypherock/coin-support-utils` and supplying family-specific callbacks. The full operation-by-operation guide with factory names and callback signatures is in [how-coin-support-works.md §4](how-coin-support-works.md#4-operations-end-to-end). Start with `createAccounts` so you can see new accounts appear, then `syncAccount`, then the send-side methods (`initializeTransaction` → `prepareTransaction` → `signTransaction` → `broadcastTransaction`).

For multi-scheme chains, add `src/operations/createAccounts/schemes/` — reference [packages/coin-support-btc/src/operations/createAccounts/schemes/](../../../packages/coin-support-btc/src/operations/createAccounts/schemes/) (multi-scheme) or [packages/coin-support-near/src/operations/createAccounts/schemes/](../../../packages/coin-support-near/src/operations/createAccounts/schemes/) (single-scheme minimal).

### 2.4 Services

Replace `src/services/index.ts` with real axios wrappers — one file per external endpoint group (`fees.ts`, `broadcast.ts`, `api/wallet.ts`, `api/transaction.ts`, …). Keep operation files free of HTTP code.

### 2.5 Tests

The script writes a single placeholder `tests/{family}.test.ts`. Add one test file per operation (`01.create.ts`, `02.createAccount.ts`, …) plus `__mocks__/` and `__fixtures__/`. Copy the structure from a neighbour like `packages/coin-support-xrp/tests/`.

---

## Step 3 — Finish the UI integration in `cysync-core`

The script added the minimum no-ops to keep the build green; everything else is conditional and depends on your chain's quirks. The full list of family-specific UI surfaces is [how-coin-support-works.md §8](how-coin-support-works.md#8-ui-integration-in-cysync-core).

### Replace the no-op map entries

| Map | Where | Replace `() => ({})` / `() => '0'` / `getDefaultSuffix` with |
|---|---|---|
| `feeInputPropsMap` | `Send/Dialogs/Components/FeeSection/index.tsx` | Function returning real props for your chain's fee input |
| `feeInputMap` (Partial) | same file | Your chain's fee input component (or reuse `XrpInput`/`EthereumInput`/`BitcoinInput`) |
| `feeHeaderMap` (Partial) | same file | Usually `FeesHeader`; custom if you have L1-fee-style display |
| `computedFeeMap` | `Send/context/index.tsx` | Function extracting the fee string from your `IPrepared{Family}Transaction` |
| `labelSuffixMap` | `Send/hooks/useLabelSuffix.ts` | Only if you need a tag like "L1" or "Testnet" |
| `anaInputMap` | `Send/.../AddressAndAmountSection/index.tsx` | Customize the generated `{Family}AddressAndAmount` if your chain needs batch / memo / etc. |

### Add the coin icon

The script does *not* touch `CoinIcon.tsx`. Once your icon exists in `@cypherock/cysync-ui`:

- Add an entry to `coinToIconMap` in `packages/cysync-core/src/components/CoinIcon.tsx`.

### Conditional branches

Review per [how-coin-support-works.md §8](how-coin-support-works.md#8-ui-integration-in-cysync-core) — only add what your chain needs:

- Destination tag / expiration / memo input maps (`SingleTransaction.tsx`)
- `SummaryDialog.tsx` — address wrapping, fee suppression, memo/expiration display
- `Receive/context/index.tsx` — only if the deposit address differs from `account.xpubOrAddress`
- `AddAccount/Dialogs/SelectionDialog.tsx` — firmware / vendor filters
- `AddAccount/context/index.tsx` — non-standard account creation flows
- `Account/index.tsx` — chain-specific action buttons
- `HistoryDialog.tsx` — non-standard tx-id field
- Hooks: `useDisplayTransactions.tsx`, `useAssetAllocations.tsx`
- `walletConnect/versions/v1.ts` — only if you support WalletConnect

```bash
pnpm --filter @cypherock/cysync-core build
```

---

## Step 4 — Verification

```bash
pnpm install
pnpm build
pnpm --filter @cypherock/coin-support-{family} test
```

Desktop-app smoke test:

1. Add Account shows the new coin; creation succeeds.
2. Receive verifies on device.
3. Send: validate, prepare (fee + validation flags), sign on device, broadcast.
4. History shows the new transaction with the correct hash + explorer link.
5. After price sync, portfolio shows fiat value.

---

## Step 5 — Tokens (optional, later)

If the chain has tokens, ship native first, then follow [adding-token-support-to-coin.md](adding-token-support-to-coin.md).

---

## Troubleshooting

The script's header comment carries a detailed troubleshooting table for build/typecheck errors that can show up after scaffold. Read it before debugging — most of "missing key in `Record<CoinFamily, ...>`" / "Cannot find module" failures have a one-line fix listed there.

---

## Final checklist

**Script run successfully**
- [ ] `pnpm scaffold:coin-family` completed without errors
- [ ] `pnpm install` + `pnpm build` are green

**`packages/coin-support-{family}/`**
- [ ] SDK app wired up in `src/utils/app.ts` (and library injection if applicable)
- [ ] `IPrepared{Family}Transaction` extended with chain-specific fields
- [ ] Every operation implemented (or explicitly left as a stub with a rationale)
- [ ] Real services replace the empty `src/services/index.ts`
- [ ] Tests per operation

**`packages/cysync-core/`**
- [ ] Icon added to `CoinIcon.tsx`
- [ ] No-op map entries replaced with real implementations (where applicable)
- [ ] Conditional branches reviewed per [how-coin-support-works.md §8](how-coin-support-works.md#8-ui-integration-in-cysync-core)

**Build & smoke test**
- [ ] `pnpm build` green
- [ ] New package's tests pass
- [ ] Desktop smoke test (add → receive → send → history → portfolio) passes
