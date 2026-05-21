# Adding a New Coin to an Existing Family

Use this guide when the chain you're adding **fits an existing family** — e.g. a new EVM L2 (Arbitrum/Optimism/Base/Linea/…), or a new BTC-fork. If the chain has a fundamentally different transaction model, follow [adding-new-coin-family-support.md](adding-new-coin-family-support.md) instead.

> **Prerequisites.** Read [how-coin-support-works.md](how-coin-support-works.md) first. The work here is small because everything in `packages/coin-support-{family}/` and most of `packages/cysync-core/` already works for any chain in the family — you just register the metadata.

---

## Decision checklist

| Question | Why it matters |
|---|---|
| Which existing family? | Determines where the metadata entry goes |
| SDK app already supports this chain? | EVM SDK is `chainId`-parameterised; BTC SDK needs per-fork code |
| BIP-44 coin type? | Goes into `coinIndex` |
| CoinGecko ID? | Required for price sync |
| EVM-specific: chain ID + network name + indexer URL | Goes into `chain` / `network`; backend must accept the new `network` |
| Custom icon? | If yes, add to `@cypherock/cysync-ui` first |
| Will it support tokens? | EVM auto-handles ERC-20 if the chain is in the token list — see [adding-token-support-to-coin.md](adding-token-support-to-coin.md) |

---

## Step 1 — Coin metadata in `packages/coins`

Background on metadata shape: [how-coin-support-works.md §6](how-coin-support-works.md#6-coin-metadata-the-coins-package).

1. **Add the coin entry** to `packages/coins/src/{family}/coins.ts`. Use a neighbour in the same family as the template — the family-specific fields (e.g. `chain`, `network` for EVM; `apiCoinType` for BTC) are listed in §6 of the explainer.
2. **Add the ID** to the family's `*IdMap` in `index.ts`. The exported coin list picks the entry up automatically.
3. **Verify**: `pnpm --filter @cypherock/coins build`.

---

## Step 2 — Coin support package updates (usually none)

### EVM pattern

For most new EVM chains: **no changes in `packages/coin-support-evm/`**. The package already routes every API call by `coin.network` and every signing call by `coin.chain`. Provided the Cypherock indexer proxy accepts your `network` key (backend coordination), it just works.

You only touch `coin-support-evm/` if your chain has unusual mechanics:

| Reason | Where |
|---|---|
| L1 fee (Optimism-style) | `src/operations/prepareTransaction/` — extend `computedData.l1Fee` |
| Different gas estimation semantics | `src/services/api/wallet.ts` — `getAverageGasPrice` |
| Unusual transaction-type encoding | `src/operations/signTransaction/` — `mapPreparedTxnToSdkTxn` |
| Different explorer URL pattern | `src/operations/getExplorerLink/` |

Branch on `coin.network` or `coin.chain` in every case.

### BTC-fork pattern

Most BTC forks "just work" because services key off `apiCoinType`. You may need to:

- Add a fallback regex in `src/operations/validateAddress/` if multicoin-address-validator doesn't recognize the chain.
- Prune unused derivation schemes in `createAccounts/schemes/` if the chain only supports a subset.

### Other families

Solana / Tron / XRP / Stellar / etc. are single-coin families today; adding to them is unusual and starts to look like a new family. If you really must, branch on `coin.network` in operation files.

---

## Step 3 — Registry & SDK

**No changes** in `packages/coin-support/` for either pattern — the family is already registered. The SDK app (`@cypherock/sdk-app-evm`, `@cypherock/sdk-app-btc`) is parameterised and usually doesn't need updates either.

---

## Step 4 — UI integration in `cysync-core`

The bulk of the UI is family-keyed (see [how-coin-support-works.md §8](how-coin-support-works.md#8-ui-integration-in-cysync-core)), so most maps and components **don't need changes**. For a same-family addition you should normally only need:

| File | Change |
|---|---|
| `src/components/CoinIcon.tsx:61-81` | Add coin to `coinToIconMap` (mandatory) |
| `src/dialogs/Send/hooks/useLabelSuffix.ts` | Optional label suffix (e.g. "L1", "Testnet") |
| `dialogs/AddAccount/Dialogs/SelectionDialog.tsx:24-46` | Optional firmware / vendor filter |

If your chain has unique explorer/summary/fee semantics you may also need conditional branches in `HistoryDialog.tsx` or `SummaryDialog.tsx` — but these are usually family-level concerns, not coin-level.

**What you should NOT need to update** for a same-family addition: any `Record<CoinFamily, ...>` map (they're keyed by family, not coin), the central registry, or the family's operation files. If you find yourself doing those, the chain probably belongs in a [new family](adding-new-coin-family-support.md).

---

## Step 5 — Tokens (optional, later)

For an EVM L2 with its own ERC-20 ecosystem: regenerate `packages/coins/src/evm/erc20.json` via `packages/automation-scripts` — see [how-token-support-works.md §6](how-token-support-works.md#6-token-json-generation-packagesautomation-scripts) and [adding-token-support-to-coin.md](adding-token-support-to-coin.md).

For BTC forks: no tokens expected.

---

## Step 6 — Verification

```bash
pnpm install
pnpm build
pnpm --filter @cypherock/coin-support-{family} test
```

Desktop smoke test: Add Account shows the new coin; create / receive / send / sign / broadcast / price sync all work end-to-end.

---

## Final checklist

**Metadata**
- [ ] New entry in `packages/coins/src/{family}/coins.ts`
- [ ] ID added to `*IdMap` in `index.ts`

**Coin support (usually unchanged)**
- [ ] L1 fee / unusual gas / unusual address: branches added if needed
- [ ] Backend indexer proxy accepts the new `network` / `apiCoinType`

**Registry** — no changes expected

**UI**
- [ ] Icon added to `coinToIconMap`
- [ ] Icon component exists in `@cypherock/cysync-ui`
- [ ] Optional label suffix / history / summary / AddAccount filter

**Build & test**
- [ ] `pnpm build` succeeds
- [ ] Family's tests still pass
- [ ] Manual smoke test passes
