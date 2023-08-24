import { getCoinSupport } from '@cypherock/coin-support';
import { IDatabase } from '@cypherock/db-interfaces';
import { lastValueFrom, merge, from, Observable } from 'rxjs';

import logger from '../utils/logger';

const MAX_RETRIES = 3;

export interface ISyncPriceHistoriesEvent {
  family: string;
  isSuccessful: boolean;
}

export const syncSinglePriceHistory = async (params: {
  db: IDatabase;
  family: string;
}): Promise<ISyncPriceHistoriesEvent> => {
  const { db, family } = params;
  const support = getCoinSupport(family);

  let isSuccessful = false;
  let retryCount = 0;
  let error: any;

  while (!isSuccessful && retryCount < MAX_RETRIES) {
    try {
      await lastValueFrom(
        support.syncPriceHistories({
          db,
        }),
      );
      isSuccessful = true;
    } catch (e) {
      retryCount += 1;
      logger.warn(
        `Error in syncing price history for family ${family}, retryCount: ${retryCount}`,
      );
      logger.warn(e);
      error = e;
    }
  }

  if (!isSuccessful && error) {
    logger.error(
      `Error in syncing price history for family ${family}. Max retries exceeded`,
    );
    logger.error(error);
  }

  return { family, isSuccessful };
};

export const syncPriceHistories = (params: {
  db: IDatabase;
  families: string[];
}) => {
  const { db, families } = params;

  const allObservables: Observable<ISyncPriceHistoriesEvent>[] = [];
  for (const family of families) {
    const observable = from(
      syncSinglePriceHistory({
        family,
        db,
      }),
    );

    allObservables.push(observable);
  }

  return merge(...allObservables);
};
