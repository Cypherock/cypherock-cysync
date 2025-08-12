import { IDatabase } from '@cypherock/db-interfaces';

export interface ISyncPricesParams {
  db: IDatabase;
  currency: string;
  waitInMSBetweenEachAPICall?: number;
}
