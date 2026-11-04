import { IDatabase } from '@cypherock/db-interfaces';

export interface ISyncPriceHistoriesParams {
  db: IDatabase;
  currency: string;
  waitInMSBetweenEachAPICall?: number;
  /**
   * Maximum number of price points stored per history series. The fetched
   * series is downsampled to this size (evenly spaced, linearly
   * interpolated). When undefined, the full series is stored as before.
   */
  maxDataPoints?: number;
}
