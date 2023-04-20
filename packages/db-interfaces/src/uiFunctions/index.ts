import {
	AccountId,
	AccountInfo,
	AssetId,
	AssetInfo,
	WalletId,
	WalletInfo,
} from "./common";
import { AssetAllocation, AssetSortOption } from "./getAssetAllocations";
import { AccountDisplayInfo, AccountSortOption } from "./getDisplayAccounts";
import { AssetBalanceHistory, PriceHistoryRange } from "./getGraphData";
import { HistoryItemInfo } from "./getHistoryItem";
import { HistoryListItemInfo, HistorySortOption } from "./getHistoryList";

export interface IUIFunctions {
	getGraphData(params: {
		assets: AssetId[];
		wallets: WalletId[];
		range: PriceHistoryRange;
	}): Promise<AssetBalanceHistory[]>;

	getAssetAllocations(params: {
		wallets: WalletId[];
		sortBy: AssetSortOption;
	}): Promise<AssetAllocation[]>;

	getDisplayAccounts: (params: {
		wallet: WalletId;
		sortBy: AccountSortOption;
	}) => Promise<AccountDisplayInfo[]>;

	getHistoryList: (params: {
		wallets: WalletId[];
		accounts: AccountId[];
		assets: AssetId[];
		sortBy?: HistorySortOption;
		limit?: number;
	}) => Promise<HistoryListItemInfo[]>;

	getHistoryItem: (params: {
		transactionHash: string;
	}) => Promise<HistoryItemInfo>;

	getAllWallets: () => Promise<WalletInfo[]>;

	getAllAssets: (params: {
		wallets?: WalletId[];
	}) => Promise<AssetInfo[]>;

	getAllAccounts: (params: {
		wallets?: WalletId[];
		assets?: AssetId[];
	}) => Promise<AccountInfo[]>;
}
