export type HistorySortOption =
	| "account"
	| "wallet"
	| "sync"
	| "amount"
	| "value";

export interface HistoryListItemInfo {
	transactionHash: string;
	accountName: string;
	walletName: string;
	assetSymbol: string;
	value: string; // balance in USD
	amount: string; // balance in asset's currency
	timestamp: number; // UI TBD for how we are displaying the time of the transaction
	transactionType: "receive" | "send" | "swap";
	status: "success" | "failed" | "pending";
	// Swap details could be moved into their own little struct only available for swap type
	swapAccountName?: string;
	swapWalletName?: string;
	swapAmount?: string;
}
