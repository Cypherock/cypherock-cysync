import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';

export interface ISyncAccountsParams {
  db: IDatabase;
  accountId: string;
  currency: string;
  waitInMSBetweenEachAPICall?: number;
  keyDB?: IKeyValueStore;
}
