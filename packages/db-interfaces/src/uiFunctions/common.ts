export type AssetId = string;
export type WalletId = string;
export type AccountId = string;

export interface WalletInfo {
	id: WalletId;
	name: string;
}

export interface AssetInfo {
	id: AssetId;
	name: string;
	symbol: string;
}

export interface AccountInfo {
	id: AccountId;
	name: string;
	address: string;
}
