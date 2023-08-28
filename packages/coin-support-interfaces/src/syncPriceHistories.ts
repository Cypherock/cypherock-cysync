import { IDatabase } from '@cypherock/db-interfaces';

export interface ISyncPriceHistoriesParams {
  db: IDatabase;
  waitInMSBetweenEachAPICall?: number;
}
