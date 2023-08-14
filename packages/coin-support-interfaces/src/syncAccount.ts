import { IDatabase } from '@cypherock/db-interfaces';

export interface ISyncAccountsParams {
  db: IDatabase;
  accountId: string;
  waitInMSBetweenEachAPICall?: number;
}
