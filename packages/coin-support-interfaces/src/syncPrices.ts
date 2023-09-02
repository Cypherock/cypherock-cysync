import { IDatabase } from '@cypherock/db-interfaces';

export interface ISyncPricesParams {
  db: IDatabase;
  waitInMSBetweenEachAPICall?: number;
}
