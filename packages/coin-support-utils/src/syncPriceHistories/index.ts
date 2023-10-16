import { sleep } from '@cypherock/cysync-utils';
import { IDatabase, IPriceHistory } from '@cypherock/db-interfaces';
import { Observable } from 'rxjs';

import { ICreateSyncPriceHistoriesObservableParams } from './types';

import { insertOrUpdatePriceHistory } from '../db';
import { getPriceHistory } from '../services';
import logger from '../utils/logger';

export * from './types';

const DEFAULT_CURRENCY = 'usd';
const MAX_RETRIES = 3;

const daysToIntervalMap = {
  30: 1 * 60 * 60 * 1000,
  365: 24 * 60 * 60 * 1000,
};

const fetchPriceHistoryForCoin = async ({
  coinId,
  db,
  days,
}: {
  coinId: { parentAssetId: string; assetId: string };
  db: IDatabase;
  days: number;
}) => {
  const prices = await getPriceHistory(coinId, DEFAULT_CURRENCY, days);

  const priceHistory: IPriceHistory = {
    assetId: coinId.assetId,
    currency: DEFAULT_CURRENCY,
    days,
    history: prices.map(e => ({ timestamp: e[0], price: e[1].toString() })),
  };

  await insertOrUpdatePriceHistory(db, [priceHistory]);
};

const getExpiredCoinList = async (
  db: IDatabase,
  coinIds: { parentAssetId: string; assetId: string }[],
  days: 30 | 365,
) => {
  const existingPriceHistories = await db.priceHistory.getAll(
    coinIds.map(id => ({ assetId: id.assetId, currency: DEFAULT_CURRENCY })),
  );

  const expiredCoinIds: { parentAssetId: string; assetId: string }[] = [];

  for (const coinId of coinIds) {
    const existingPriceInfo = existingPriceHistories.find(
      p => p.assetId === coinId.assetId && days === p.days,
    );

    if (!existingPriceInfo) {
      expiredCoinIds.push(coinId);
    } else {
      const snapshots = existingPriceInfo.history.sort(
        (a, b) => b.timestamp - a.timestamp,
      );
      const latestSnapshot = snapshots[0];

      if (
        !latestSnapshot ||
        latestSnapshot.timestamp + daysToIntervalMap[days] < Date.now()
      ) {
        expiredCoinIds.push(coinId);
      }
    }
  }

  return expiredCoinIds;
};

export function createSyncPriceHistoriesObservable(
  params: ICreateSyncPriceHistoriesObservableParams,
) {
  return new Observable<void>(observer => {
    let finished = false;

    const unsubscribe = () => {
      finished = true;
    };

    const main = async () => {
      try {
        const { db, getCoinIds } = params;

        const coinIds = await getCoinIds(db);

        for (const days of [30, 365]) {
          const expiredCoinIds = await getExpiredCoinList(
            db,
            coinIds,
            days as any,
          );

          let retries = 0;

          for (let i = 0; i < expiredCoinIds.length; i += 1) {
            const coinId = expiredCoinIds[i];

            try {
              await fetchPriceHistoryForCoin({ coinId, db, days });
              await sleep(params.waitInMSBetweenEachAPICall ?? 500);
            } catch (error) {
              retries += 1;
              i -= 1;
              logger.warn('Error while fetching price history');
              logger.warn(error);

              if (retries >= MAX_RETRIES) {
                logger.error('Max tries exceeded while fetching price history');
                logger.error(error);
                throw error;
              }
            }
          }
        }

        observer.next();
        observer.complete();
      } catch (error) {
        if (!finished) {
          observer.error(error);
        }
      }
    };

    main();

    return unsubscribe;
  });
}
