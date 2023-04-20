export type PriceHistoryRange = 1 | 30 | 365;

export interface AssetBalanceHistory {
	history: BalanceHistory[];
	assetInfo: {
		name: string;
		symbol: string;
		latestPrice: string;
	};
}

export interface BalanceHistory {
	timestamp: number; // Unix epoch timestamp
	value: string; // ba lance in USD
	amount: string; // balance in asset's currency
}
