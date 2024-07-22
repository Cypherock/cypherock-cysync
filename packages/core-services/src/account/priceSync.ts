import { getCoinSupport } from '@cypherock/coin-support';
import { PromiseQueue } from '@cypherock/cysync-utils';
import { IDatabase } from '@cypherock/db-interfaces';
import { lastValueFrom, Observable } from 'rxjs';

import logger from '../utils/logger';

const MAX_RETRIES = 3;
const PRICE_SYNC_CONCURRENCY = 5;

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

  return new Observable<ISyncPricesEvent>(observer => {
    let promiseQueue: PromiseQueue<ISyncPricesEvent> | undefined;

    const unsubscribe = () => {
      if (promiseQueue) {
        promiseQueue.abort();
      }
    };

    const main = async () => {
      try {
        promiseQueue = new PromiseQueue({
          tasks: families.map(
            f => () =>
              syncSinglePrice({
                family: f,
                db,
              }),
          ),
          concurrentCount: PRICE_SYNC_CONCURRENCY,
          onComplete: () => {
            observer.complete();
          },
          onNext: result => {
            observer.next(result);
          },
          onError: error => {
            observer.error(error);
          },
        });

        promiseQueue.run();
      } catch (error) {
        observer.error(error);
      }
    };

    main();

    return unsubscribe;
  });
};
