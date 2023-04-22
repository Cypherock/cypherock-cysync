export type AssetSortOption =
  | 'asset'
  | 'price'
  | 'amount'
  | 'value'
  | 'allocation';

export interface IAssetAllocation {
  name: string;
  symbol: string;
  latestPrice: string;
  value: string; // balance in USD
  amount: string; // balance in asset's currency
  allocation: number; // percentage of total balance allocated to this asset
}
