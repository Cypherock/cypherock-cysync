import { sleep } from '@cypherock/cysync-utils';
import { IDatabase, IPriceInfo } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import { Observable } from 'rxjs';

import { ICreateSyncPricesObservableParams } from './types';

import { insertOrUpdatePriceInfo } from '../db';
import { getLatestPrices } from '../services';
import logger from '../utils/logger';

export * from './types';

const DEFAULT_CURRENCY = 'usd';
const PRICE_SYNC_INTERVAL_IN_SEC = 60;
const BATCH_SIZE = 20;
const MAX_RETRIES = 3;

const fetchLatestPricesForBatch = async ({
  coinIds,
  db,
}: {
  coinIds: { parentAssetId: string; assetId: string }[];
  db: IDatabase;
}) => {
  const prices = await getLatestPrices(coinIds, DEFAULT_CURRENCY);
  const allPriceInfos: IPriceInfo[] = prices.map(elem => ({
    assetId: elem.assetId,
    currency: DEFAULT_CURRENCY,
    lastSyncedAt: Date.now(),
    latestPrice: elem.price.toString(),
  }));

  await insertOrUpdatePriceInfo(db, allPriceInfos);
};

export function createSyncPricesObservable(
  params: ICreateSyncPricesObservableParams,
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

        const existingPrices = await db.priceInfo.getAll(
          coinIds.map(coin => ({
            assetId: coin.assetId,
            currency: DEFAULT_CURRENCY,
          })),
        );

        const expiredCoinIds: { parentAssetId: string; assetId: string }[] = [];

        for (const coinId of coinIds) {
          const existingPriceInfo = existingPrices.find(
            p => p.assetId === coinId.assetId,
          );

          if (
            !existingPriceInfo?.lastSyncedAt ||
            Date.now() - existingPriceInfo.lastSyncedAt >
              1000 * PRICE_SYNC_INTERVAL_IN_SEC
          ) {
            expiredCoinIds.push(coinId);
          }
        }

        const coinListBatch = lodash.chunk(
          lodash.shuffle(expiredCoinIds),
          BATCH_SIZE,
        );

        let retries = 0;

        for (let i = 0; i < coinListBatch.length; i += 1) {
          const coinList = coinListBatch[i];

          try {
            await fetchLatestPricesForBatch({ coinIds: coinList, db });
            await sleep(params.waitInMSBetweenEachAPICall ?? 500);

            if (finished) return;
          } catch (error) {
            retries += 1;
            i -= 1;
            logger.warn('Error while fetching latest coin prices');
            logger.warn(error);

            if (retries >= MAX_RETRIES) {
              logger.error(
                'Max tries exceeded while fetching latest coin prices',
              );
              logger.error(error);
              throw error;
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
