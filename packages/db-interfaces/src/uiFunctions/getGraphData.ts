export type PriceHistoryRange = 1 | 30 | 365;

export interface IAssetBalanceHistory {
  history: IBalanceHistory[];
  assetInfo: {
    name: string;
    symbol: string;
    latestPrice: string;
  };
}

export interface IBalanceHistory {
  timestamp: number; // Unix epoch timestamp
  value: string; // ba lance in USD
  amount: string; // balance in asset's currency
}
