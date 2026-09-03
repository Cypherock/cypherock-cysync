---
'@cypherock/cysync-core': patch
---

surface real errors in the WalletConnect sign message flow instead of silently closing the dialog and reporting "User rejected" to the dApp; reject WalletConnect requests with unsupported methods or chains with no connected account instead of leaving the dApp waiting and the signing checklist stuck
