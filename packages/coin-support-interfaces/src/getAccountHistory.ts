import {
  IAccount,
  IDatabase,
  IPriceHistory,
  ITransaction,
} from '@cypherock/db-interfaces';

export interface IBalanceHistory {
  timestamp: number;
  balance: string;
  value: string;
}

export interface IGetAccountHistoryParams {
  db: IDatabase;
  accountId: string;
  currency: string;
  days: 1 | 7 | 30 | 365;
  account?: IAccount;
  transactions?: ITransaction[];
  priceHistories?: IPriceHistory[];
}

export interface IGetAccountHistoryResult {
  history: IBalanceHistory[];
  account: IAccount;
}
