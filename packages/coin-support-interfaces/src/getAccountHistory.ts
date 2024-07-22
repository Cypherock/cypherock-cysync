import {
  IAccount,
  IDatabase,
  IPriceHistory,
  IPriceInfo,
  ITransaction,
} from '@cypherock/db-interfaces';

export interface IBalanceHistory {
  timestamp: number;
  balance: string;
  value: string;
}

export interface IGetAccountHistoryParams {
  db?: IDatabase;
  accountId: string;
  currency: string;
  days: 1 | 7 | 30 | 365;
  account?: IAccount;
  transactions?: ITransaction[];
  priceHistories?: IPriceHistory[];
  priceInfos?: IPriceInfo[];
}

export interface IGetAccountHistoryResult {
  history: IBalanceHistory[];
  account: IAccount;
  currentValue: string;
}
