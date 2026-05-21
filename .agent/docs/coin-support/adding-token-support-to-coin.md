# Adding Token Support to an Existing Coin

How to add **fungible-token** support (ERC-20, SPL, TRC-20, ICRC, Canton-instrument, …) to a coin that already has native support.

> **Prerequisites.** Read [how-coin-support-works.md](how-coin-support-works.md) and [how-token-support-works.md](how-token-support-works.md) first. This guide only names the work items — the mechanics (assetId format, sub-account model, per-operation differences, JSON pipeline) are all in those docs.

For adding **native** coin support, see [adding-new-coin-support.md](adding-new-coin-support.md) instead.

---

## Two scenarios

| | Scenario A | Scenario B |
|---|---|---|
| **When** | The family already supports tokens (e.g. you added a new EVM chain and want its ERC-20s, or a new SPL token list) | The family doesn't yet have token support |
| **Effort** | Mostly automation + a UI mapping or two | Design the token model, write `token.ts`, add token branches to every relevant operation |
| **Reference** | [how-token-support-works.md §6](how-token-support-works.md#6-token-json-generation-packagesautomation-scripts) | [how-token-support-works.md §3](how-token-support-works.md#3-per-operation-deep-dive-token-differences) (per-operation deep dive) |

Existing token interfaces (see [how-token-support-works.md §1.3](how-token-support-works.md#13-token-metadata-loading)): EVM `IEvmErc20Token`, Solana `ISolanaSplToken`, Tron `ITronTrc20Token`, ICP `IIcpIcrcToken`, Canton `ICantonToken`.

---

## Step 1 — Token metadata in `packages/coins`

### Scenario A — family already has `token.ts`

Run the automation script to refresh the family's JSON list. The pipeline and refresh workflow are documented in [how-token-support-works.md §6.4](how-token-support-works.md#64-refresh-workflow). At a high level:

```bash
pnpm --filter @cypherock/automation-scripts {family}-diff       # review change set
pnpm --filter @cypherock/automation-scripts gen-{family}-list   # generate JSON
# Copy .data/{family}-token.json into packages/coins/src/{family}/{family}.json
pnpm --filter @cypherock/coins build
```

Check the regenerated JSON for your chain's CoinGecko platform key — tokens missing `platforms.{platformKey}` won't load. If the platform key isn't in CoinGecko, coordinate with the automation/backend team.

### Scenario B — family doesn't yet have token support

Build the token machinery from scratch using EVM as the template ([packages/coins/src/evm/token.ts](../../../packages/coins/src/evm/token.ts)):

1. **Define `INewfamilyToken`** extending `ICoinInfo` with `parentId`, `address`, and any chain-specific extras (decimals, canister IDs, instrument fields).
2. **Implement an `assetId` factory** producing `parentAssetId:tokenId[|version]` — see [how-token-support-works.md §1.1](how-token-support-works.md#11-assetid-format).
3. **Build the token list from JSON** — walk entries, skip those without your chain's platform key, validate required fields, produce `tokens` (by assetId) and `tokensByContract` (by lowercase address) maps. Mirror the EVM pattern.
4. **Update the family's `index.ts`** — augment `INewfamilyCoinInfo` with `tokens` and `tokensByContract`; re-export the token interface and assetId factory.
5. **Update `packages/coins/src/aggregate.ts`** — add the token ID type to `TokenTypes`.
6. **Seed the JSON list** at `packages/coins/src/{family}/{family}-tokens.json` matching the schema in [how-token-support-works.md §6.3](how-token-support-works.md#63-output-schema), then add a generator under `packages/automation-scripts/src/commands/{family}/` following the existing pipeline shape (§6.2 of the explainer).

---

## Step 2 — Coin support package updates

### Scenario A

Usually **no changes** in `packages/coin-support-{family}/`. Confirm the family-level operations work for the new chain:

- `syncAccount` picks up contract-transfer logs.
- Contract `balanceOf` calls work.
- Signing payload contains the contract address correctly.

If any of those break, fix in the family's existing operation files (same locations cited in [how-token-support-works.md §3](how-token-support-works.md#3-per-operation-deep-dive-token-differences)).

### Scenario B

Add token branches to every relevant operation. [how-token-support-works.md §3](how-token-support-works.md#3-per-operation-deep-dive-token-differences) is the spec — it lays out for each operation what changes for sub-accounts, with code references for EVM/Solana/Tron/ICP/Canton as reference implementations. The work list:

- **`syncAccount`** — discover tokens, create sub-accounts, trigger price + history sync via the `onNewAccounts` hook.
- **`initializeTransaction`** — fetch token-specific static data (rent / energy / ledger canister, depending on chain).
- **`prepareTransaction`** — branch on `account.type === AccountTypeMap.subAccount`; encode the token transfer; validate fee against the **parent native** balance (see §3.5 of the explainer).
- **`signTransaction`** — pass a token-specific SDK payload; derivation path stays the parent's.
- **`broadcastTransaction`** — usually unchanged.
- **`receive`** — only diverges if the deposit address differs from the parent's (SPL ATA-style, ICP-style).
- **`getCoinIds`** — already returns one entry per held asset; no change needed.

---

## Step 3 — UI integration in `cysync-core`

Token UI surfaces are listed in [how-token-support-works.md §4](how-token-support-works.md#4-ui-integration-in-cysync-core). For most scenarios:

- **Token icons** — add major tokens (USDT, USDC, …) to `TokenToIconMap` in `src/components/CoinIcon.tsx`. Generic icon falls back automatically for the rest.
- **AddToken dialog** — Scenario A: tokens auto-appear because the dialog assembles `tokenList` from `evmCoinList[*].tokens` (etc.). Scenario B: append your `newfamilyCoinList` to the aggregator (around lines 159-181 of `dialogs/AddToken/context/index.tsx`) and extend the `extraData` block (~288-310) if tokens need extra persistent state.
- **Send dialog** — already branches on `account.type`; no per-family changes for Scenario A. Scenario B: review the family's `feeInputMap` / `feeInputPropsMap` / `anaInputMap` entries to confirm they handle sub-accounts (see [how-coin-support-works.md §8.2](how-coin-support-works.md#82-send-dialog-always-if-the-coin-can-send)).
- **History & Portfolio** — no UI changes; both already render tokens via `assetId` / `(parentAssetId, assetId)` keying.

---

## Step 4 — Verification

```bash
pnpm install
pnpm build
pnpm --filter @cypherock/coin-support-{family} test
```

For Scenario B, add tests exercising the new token branches (discovery, balance, prepare, sign).

Desktop smoke test:

1. AddToken dialog shows your tokens; adding creates a sub-account.
2. Sync populates the token balance.
3. Receive shows the correct deposit address per chain.
4. Send: token balance, parent-native fee, sign, broadcast.
5. History row + portfolio entry + price sync work.

---

## Final checklist

**Metadata (`packages/coins/`)**
- [ ] Family `token.ts` exists (Scenario B created it; Scenario A unchanged)
- [ ] JSON regenerated and copied into `packages/coins/src/{family}/`
- [ ] `assetId` factory produces `parentAssetId:tokenId[|version]`
- [ ] `tokens` / `tokensByContract` populate on parent coin objects
- [ ] Scenario B: `TokenTypes` union updated in `aggregate.ts`

**Coin support (`packages/coin-support-{family}/`)**
- [ ] Scenario A: no changes; tests pass
- [ ] Scenario B: token branches added per [how-token-support-works.md §3](how-token-support-works.md#3-per-operation-deep-dive-token-differences)

**Automation (`packages/automation-scripts/`)**
- [ ] Scenario A: ran `gen-{family}-list`, reviewed diff, copied JSON
- [ ] Scenario B: new `gen-{family}-list` script added

**UI (`packages/cysync-core/`)**
- [ ] Token icons for majors in `TokenToIconMap`
- [ ] AddToken aggregator includes the family's coin list (Scenario B)
- [ ] `extraData` branches added for tokens needing extra state (Scenario B)

**Build & test**
- [ ] `pnpm build` succeeds
- [ ] Family tests pass
- [ ] Manual smoke test passes
