export type AssetId = string;
export type WalletId = string;
export type AccountId = string;

export interface IWalletInfo {
  id: WalletId;
  name: string;
}

export interface IAssetInfo {
  id: AssetId;
  name: string;
  symbol: string;
}

export interface IAccountInfo {
  id: AccountId;
  name: string;
  address: string;
}
