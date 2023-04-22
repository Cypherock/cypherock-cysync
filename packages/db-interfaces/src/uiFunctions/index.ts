import {
  AccountId,
  IAccountInfo,
  AssetId,
  IAssetInfo,
  WalletId,
  IWalletInfo,
} from './common';
import { IAssetAllocation, AssetSortOption } from './getAssetAllocations';
import { IAccountDisplayInfo, AccountSortOption } from './getDisplayAccounts';
import { IAssetBalanceHistory, PriceHistoryRange } from './getGraphData';
import { IHistoryItemInfo } from './getHistoryItem';
import { IHistoryListItemInfo, HistorySortOption } from './getHistoryList';

export interface IUIFunctions {
  getGraphData(params: {
    assets: AssetId[];
    wallets: WalletId[];
    range: PriceHistoryRange;
  }): Promise<IAssetBalanceHistory[]>;

  getAssetAllocations(params: {
    wallets: WalletId[];
    sortBy: AssetSortOption;
  }): Promise<IAssetAllocation[]>;

  getDisplayAccounts: (params: {
    wallet: WalletId;
    sortBy: AccountSortOption;
  }) => Promise<IAccountDisplayInfo[]>;

  getHistoryList: (params: {
    wallets: WalletId[];
    accounts: AccountId[];
    assets: AssetId[];
    sortBy?: HistorySortOption;
    limit?: number;
  }) => Promise<IHistoryListItemInfo[]>;

  getHistoryItem: (params: {
    transactionHash: string;
  }) => Promise<IHistoryItemInfo>;

  getAllWallets: () => Promise<IWalletInfo[]>;

  getAllAssets: (params: { wallets?: WalletId[] }) => Promise<IAssetInfo[]>;

  getAllAccounts: (params: {
    wallets?: WalletId[];
    assets?: AssetId[];
  }) => Promise<IAccountInfo[]>;
}
