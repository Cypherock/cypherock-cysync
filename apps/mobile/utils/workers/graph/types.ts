import { IBalanceHistory } from '@cypherock/coin-support-interfaces';
import {
  IWallet,
  IAccount,
  ITransaction,
  IPriceHistory,
  IPriceInfo,
} from '@cypherock/db-interfaces';

export interface UseGraphProps {
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
  selectedWallet?: IWallet;
}

export interface CalculatePortfolioGraphDataParams {
  accounts: IAccount[];
  transactions: ITransaction[];
  priceHistories: IPriceHistory[];
  priceInfos: IPriceInfo[];
  days: 1 | 7 | 30 | 365;
  selectedWallet?: IWallet;
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
  showGraphInUSD: boolean;
}

export interface CalculatePortfolioGraphDataParamsWithComputedData
  extends CalculatePortfolioGraphDataParams {
  computedData: {
    balanceHistory: IBalanceHistory[];
    totalValue: string;
  };
}
