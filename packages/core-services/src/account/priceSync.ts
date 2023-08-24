import { getCoinSupport } from '@cypherock/coin-support';
import { IDatabase } from '@cypherock/db-interfaces';
import { lastValueFrom, merge, from, Observable } from 'rxjs';

import logger from '../utils/logger';

const MAX_RETRIES = 3;

export interface ISyncPricesEvent {
  family: string;
  isSuccessful: boolean;
}

export const syncSinglePrice = async (params: {
  db: IDatabase;
  family: string;
}): Promise<ISyncPricesEvent> => {
  const { db, family } = params;
  const support = getCoinSupport(family);

  let isSuccessful = false;
  let retryCount = 0;
  let error: any;

  while (!isSuccessful && retryCount < MAX_RETRIES) {
    try {
      await lastValueFrom(
        support.syncPrices({
          db,
        }),
      );
      isSuccessful = true;
    } catch (e) {
      retryCount += 1;
      logger.warn(
        `Error in syncing prices for family ${family}, retryCount: ${retryCount}`,
      );
      logger.warn(e);
      error = e;
    }
  }

  if (!isSuccessful && error) {
    logger.error(
      `Error in syncing prices for family ${family}. Max retries exceeded`,
    );
    logger.error(error);
  }

  return { family, isSuccessful };
};

export const syncPrices = (params: { db: IDatabase; families: string[] }) => {
  const { db, families } = params;

  const allObservables: Observable<ISyncPricesEvent>[] = [];
  for (const family of families) {
    const observable = from(
      syncSinglePrice({
        family,
        db,
      }),
    );

    allObservables.push(observable);
  }

  return merge(...allObservables);
};
