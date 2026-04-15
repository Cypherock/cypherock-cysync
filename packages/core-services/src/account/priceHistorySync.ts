import { getCoinSupport } from '@cypherock/coin-support';
import { PromiseQueue } from '@cypherock/cysync-utils';
import { IDatabase } from '@cypherock/db-interfaces';
import { lastValueFrom, Observable } from 'rxjs';

import logger from '../utils/logger';
import { isReactNative } from '../platform';

const getMaxRetries = () => (isReactNative() ? 1 : 3);
const getPriceHistorySyncConcurrency = () => (isReactNative() ? 50 : 5);

export interface ISyncPriceHistoriesEvent {
  family: string;
  isSuccessful: boolean;
}

export const syncSinglePriceHistory = async (params: {
  db: IDatabase;
  family: string;
  currency: string;
}): Promise<ISyncPriceHistoriesEvent> => {
  const { db, family, currency } = params;
  const support = getCoinSupport(family);

  let isSuccessful = false;
  let retryCount = 0;
  let error: any;

  while (!isSuccessful && retryCount < getMaxRetries()) {
    try {
      await lastValueFrom(
        support.syncPriceHistories({
          db,
          currency,
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
  currency: string;
}) => {
  const { db, families, currency } = params;

  return new Observable<ISyncPriceHistoriesEvent>(observer => {
    let promiseQueue: PromiseQueue<ISyncPriceHistoriesEvent> | undefined;

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
              syncSinglePriceHistory({
                family: f,
                db,
                currency,
              }),
          ),
          concurrentCount: getPriceHistorySyncConcurrency(),
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
