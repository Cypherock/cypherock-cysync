import { IDatabase } from '@cypherock/db-interfaces';

export interface IBalanceHistory {
  timestamp: number;
  balance: string;
}

export interface IGetAccountHistoryParams {
  db: IDatabase;
  accountId: string;
}

export interface IGetAccountHistoryResult {
  history: IBalanceHistory[];
}
