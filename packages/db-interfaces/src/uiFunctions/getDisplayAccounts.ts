export type AccountSortOption =
	| "account"
	| "wallet"
	| "sync"
	| "amount"
	| "value";

export interface AccountDisplayInfo {
	name: string;
	assetName: string;
	derivationPath: string;
	assetSymbol: string;
	value: string; // balance in USD
	amount: string; // balance in asset's currency
	childrenAccounts: AccountDisplayInfo[]; // tokens or custom accounts
}
