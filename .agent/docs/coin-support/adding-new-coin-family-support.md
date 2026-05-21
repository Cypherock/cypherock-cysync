# Adding a New Coin Family

Use this guide when the chain you're adding **doesn't fit any existing family** — e.g. a new L1 with a unique transaction model, derivation, or account structure. If the new chain is just another EVM/UTXO/etc. instance, follow [adding-new-coin-support-to-existing-family.md](adding-new-coin-support-to-existing-family.md) instead.

> **Prerequisites.** Read [how-coin-support-works.md](how-coin-support-works.md) end-to-end first. It defines the `CoinSupport` contract, `IPreparedTransaction`, the per-package layout, the registry, and the full UI integration map. This guide only names the **work items**; mechanics are in that doc.

Adding a family means creating:

1. Metadata in [`packages/coins`](../../../packages/coins/).
2. A new `packages/coin-support-{family}` package implementing `CoinSupport`.
3. Registration in [`packages/coin-support`](../../../packages/coin-support/).
4. UI hooks in [`packages/cysync-core`](../../../packages/cysync-core/).
5. Probably a new SDK app `@cypherock/sdk-app-{family}` (coordinate with the SDK team — out of scope here).

---

## Decision checklist before you start

| Question | Why it matters |
|---|---|
| Address format? | Determines `validateAddress` / `formatAddress` |
| UTXO-based or account-based? | UTXO needs coin selection; account-based needs nonce management |
| BIP-44 coin type? | Goes into `coinIndex` |
| Multiple derivation schemes? | If yes, needs `operations/createAccounts/schemes/` |
| Extra user inputs (memo, destination tag, expiration, …)? | Affects `IPreparedTransaction.userInputs` + Send dialog |
| Account activation / reserve required? | Adds validation flags |
| SDK app exists? | If not, coordinate with SDK team |
| Indexer/API? | Cypherock-hosted proxy or public RPC |
| Heavy crypto library to inject? | Add a `set{Lib}Library` static method (BTC/EVM pattern) |
| Tokens later? | Ship native-only first, then follow [adding-token-support-to-coin.md](adding-token-support-to-coin.md) |

Pick a short lowercase family name (e.g. `cosmos`, `aptos`) — it becomes a directory name and a string literal everywhere.

---

## Step 1 — Coin metadata in `packages/coins`

Background: [how-coin-support-works.md §6](how-coin-support-works.md#6-coin-metadata-the-coins-package) shows the `coins.ts` / `index.ts` shape, the base `ICoinInfo` fields, and the family-specific extras used by existing chains.

1. **Create `packages/coins/src/{family}/coins.ts`** — array of coin definitions. Use [packages/coins/src/xrp/coins.ts](../../../packages/coins/src/xrp/coins.ts) as the simplest template, [packages/coins/src/btc/coins.ts](../../../packages/coins/src/btc/coins.ts) for a multi-coin family.
2. **Create `packages/coins/src/{family}/index.ts`** — export the family interface, the ID map, and the typed coin list. Mirror [packages/coins/src/xrp/index.ts](../../../packages/coins/src/xrp/index.ts).
3. **Register the family**:
   - `packages/coins/src/types.ts` — add the key to `coinFamiliesMap`.
   - `packages/coins/src/aggregate.ts` — import the coin list and ID type; add to `coinList`; add ID to `CoinTypes` union.
   - `packages/coins/src/index.ts` — `export * from './{family}'`.
4. **Verify**: `pnpm --filter @cypherock/coins build`. Adding the family to `coinFamiliesMap` will surface "missing key" errors in every `Record<CoinFamily, ...>` map across `cysync-core` — those get fixed in Step 4.

---

## Step 2 — Create the `coin-support-{family}` package

Background: [how-coin-support-works.md §5.2](how-coin-support-works.md#52-per-package-layout) shows the directory layout, and [§4](how-coin-support-works.md#4-operations-end-to-end) walks each operation. Read those before scaffolding.

### 2.1 Scaffold

Copy the layout (per-package layout in §5.2 of the explainer) from the closest existing package:

- Account-based, single derivation, no extras → **XRP**
- Account-based with memo → **Stellar**
- UTXO-based with derivation schemes → **BTC**
- Multi-chain account-based → **EVM**
- Smart-contract accounts → **Starknet**

### 2.2 `package.json`

Copy from an existing coin-support package and rename. Required workspace deps:

```json
"@cypherock/coin-support-interfaces": "workspace:^",
"@cypherock/coin-support-utils":      "workspace:^",
"@cypherock/coins":                   "workspace:^",
"@cypherock/db-interfaces":           "workspace:^",
"@cypherock/sdk-app-{family}":        "^x.x.x",
"@cypherock/sdk-interfaces":          "^x.x.x",
"@cypherock/sdk-utils":               "^x.x.x",
"axios":                              "^1.4.0",
"rxjs":                               "^7.8.1"
```

Plus your chain-specific crypto/SDK library. Copy `tsconfig.json` and `jest.config.js` verbatim from a neighbour.

### 2.3 Implement utilities & services

The shape of every `src/utils/` and `src/services/` file is described in [how-coin-support-works.md §5.2 and §5.3](how-coin-support-works.md#52-per-package-layout). Copy from BTC/EVM and adapt:

- `src/utils/app.ts` — `createApp` + `getAppletId`.
- `src/utils/logger.ts` — scoped logger + `updateLogger`.
- `src/utils/getCoinIds.ts` — accounts → `{ assetId, parentAssetId }` list (used by `syncPrices` / `getCoinAllocations`).
- `src/services/` — axios wrappers; keep operation files free of HTTP code.

### 2.4 Define `src/operations/transaction.ts`

Extend `IPreparedTransaction` with your chain's `userInputs` / `staticData` / `computedData` / extra validation flags. Background and reference implementations in [how-coin-support-works.md §3](how-coin-support-works.md#3-the-shared-ipreparedtransaction).

### 2.5 Implement each operation

[how-coin-support-works.md §4](how-coin-support-works.md#4-operations-end-to-end) explains every operation, the `coin-support-utils` factory it uses, and the family callbacks each factory expects. Implement each `operations/{op}/index.ts` by:

1. Defining param types in `operations/types.ts`.
2. Calling the relevant factory from `coin-support-utils` (see the table in §4 of the explainer).
3. Supplying the family-specific callbacks (SDK calls + service calls).

Operations with no factory — `initializeTransaction`, `prepareTransaction`, `broadcastTransaction`, `validateAddress`, `formatAddress`, `getAccountAddress`, `getExplorerLink` — are written from scratch but follow the patterns documented in §4.

If your chain has multiple derivation schemes, add `operations/createAccounts/schemes/` — reference [packages/coin-support-btc/src/operations/createAccounts/schemes/](../../../packages/coin-support-btc/src/operations/createAccounts/schemes/) (multi-scheme) or [packages/coin-support-near/src/operations/createAccounts/schemes/](../../../packages/coin-support-near/src/operations/createAccounts/schemes/) (single-scheme minimal).

### 2.6 Main class — `src/index.ts`

Implement `CoinSupport` as thin delegators to `operations.*` — exactly the shape shown in [how-coin-support-works.md §4](how-coin-support-works.md#4-operations-end-to-end). Stub unimplemented methods with `throw new Error('Method not implemented')`.

If you need a `setXxxLibrary` static method for an injected crypto library, follow the BTC / EVM template (see §5.3 of the explainer).

### 2.7 Tests

Copy the `tests/` skeleton from a neighbour. Convention: one `.ts` file per operation (`01.create.ts`, `02.createAccount.ts`, …), plus `__mocks__/` and `__fixtures__/`.

---

## Step 3 — Register in the central registry

1. `packages/coin-support/src/index.ts` — import your `NewcoinSupport`, add it to `coinSupportMap[coinFamiliesMap.newcoin]`.
2. `packages/coin-support/package.json` — add `"@cypherock/coin-support-newcoin": "workspace:^"`.
3. **Library injection** (only if you added a `setXxxLibrary` static method) — wire it into desktop and CLI bootstrap. Grep for `setBitcoinLibrary` / `setEthersLibrary` to find the call sites.

---

## Step 4 — UI integration in `cysync-core`

[how-coin-support-works.md §8](how-coin-support-works.md#8-ui-integration-in-cysync-core) is the canonical checklist of every file `cysync-core` branches on family. Treat that section as the spec — every `Record<CoinFamily, ...>` map listed there needs an entry for your new family (TypeScript will refuse to build otherwise), and each conditional-branch file should be reviewed against your chain's quirks.

In short:

- **Mandatory** — `CoinIcon.tsx` `coinToIconMap`; all the `Record<CoinFamily, ...>` maps in the Send dialog.
- **Conditional** — Receive context, AddAccount selection/context, Account page, History dialog, hooks, WalletConnect — only when your chain has the relevant quirk.

After UI edits:

```bash
pnpm install
pnpm --filter @cypherock/cysync-core build
```

Most TS errors will be missing-key complaints from `Record<CoinFamily, ...>` maps — fix by adding entries per §8 of the explainer.

---

## Step 5 — Verification

```bash
pnpm install
pnpm build
pnpm --filter @cypherock/coin-support-{family} test
```

Then desktop-app smoke test:

1. Add Account shows the new coin; creation succeeds.
2. Receive verifies on device.
3. Send: validate, prepare (fee + validation flags), sign on device, broadcast.
4. History shows the new transaction with the correct hash + explorer link.
5. After price sync, portfolio shows fiat value.

---

## Step 6 — Tokens (optional, later)

If the chain has tokens, ship native first, then follow [adding-token-support-to-coin.md](adding-token-support-to-coin.md).

---

## Final checklist

**`packages/coins/`**
- [ ] `src/types.ts` — family added to `coinFamiliesMap`
- [ ] `src/{family}/coins.ts` + `index.ts` — definitions, ID map, family interface
- [ ] `src/aggregate.ts` — `coinList` + `CoinTypes` union updated
- [ ] `src/index.ts` — re-export added

**`packages/coin-support-{family}/`**
- [ ] Package scaffolded (operations / services / utils)
- [ ] `src/index.ts` implements `CoinSupport` end-to-end
- [ ] Tests per operation

**`packages/coin-support/`**
- [ ] Registered in `coinSupportMap`
- [ ] Dependency added
- [ ] Library injection wired into desktop + CLI bootstrap (if applicable)

**`packages/cysync-core/`** (full list in [how-coin-support-works.md §8](how-coin-support-works.md#8-ui-integration-in-cysync-core))
- [ ] Icon mapping
- [ ] Every `Record<CoinFamily, ...>` map has an entry
- [ ] Conditional branches reviewed (Send summary, Receive, AddAccount, Account page, History, hooks, WalletConnect)

**Build**
- [ ] `pnpm build` succeeds
- [ ] New package's tests pass
- [ ] Desktop smoke test passes
