# Adding New Coin Support

Entry-point router for adding a new blockchain to CySync.

> **Read first.** [how-coin-support-works.md](how-coin-support-works.md) explains the registry, the `CoinSupport` contract, the operation flow, the `coin-support-utils` factories, and the full UI integration map. Both sub-guides below assume you've read it.

## Pick the right sub-guide

### Case 1 — The new coin belongs to an existing family

Use when the chain shares its transaction model, address format, signing scheme, and SDK app with an existing family — e.g. another EVM L2, or a Bitcoin-style fork.

How to tell: a family directory in [packages/coins/src/](../../../packages/coins/src/) already contains chains with the same model as yours.

➡️ Follow [adding-new-coin-support-to-existing-family.md](adding-new-coin-support-to-existing-family.md).

### Case 2 — The new coin needs a brand-new family

Use when the chain has a unique transaction model, derivation scheme, signing flow, or account structure that no existing family covers. The existing families (Solana, XRP, Stellar, Starknet, Canton, ICP, Near, Sia) each landed as their own family for exactly this reason.

How to tell: implementing it inside an existing family would require `if (family === ...)` branches in multiple operation files.

➡️ Follow [adding-new-coin-family-support.md](adding-new-coin-family-support.md).

---

## Tokens

Both sub-guides cover **native coin only**. If the chain also needs fungible tokens, ship native first, then follow [adding-token-support-to-coin.md](adding-token-support-to-coin.md). Background is in [how-token-support-works.md](how-token-support-works.md).

---

## Doc map

| Doc | Use when |
|---|---|
| [how-coin-support-works.md](how-coin-support-works.md) | Understanding native-coin architecture end-to-end |
| [how-token-support-works.md](how-token-support-works.md) | Understanding how tokens layer on top |
| [adding-new-coin-support.md](adding-new-coin-support.md) | (You are here) Picking which sub-guide to follow |
| [adding-new-coin-family-support.md](adding-new-coin-family-support.md) | The chain needs a new family |
| [adding-new-coin-support-to-existing-family.md](adding-new-coin-support-to-existing-family.md) | The chain fits an existing family |
| [adding-token-support-to-coin.md](adding-token-support-to-coin.md) | Adding tokens on top of a native coin |
