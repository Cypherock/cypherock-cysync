const { coinFamiliesMap } = require('@cypherock/coins');
const {
  syncPriceHistories: syncPriceHistoriesCore,
  ISyncPriceHistoriesEvent,
} = require('@cypherock/cysync-core-services');
import { Observer } from 'rxjs';

import { getDB } from '@/utils';

export const syncPriceHistories = ({
  families,
  currency,
}: {
  families: string[];
  currency: string;
}) =>
  new Promise<void>(resolve => {
    const observer: Observer<typeof ISyncPriceHistoriesEvent> = {
      error: () => {
        resolve();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      next: () => {},
      complete: () => {
        resolve();
      },
    };

    syncPriceHistoriesCore({
      db: getDB(),
      families,
      currency,
    }).subscribe(observer);
  });

export const syncAllPriceHistories = async (currency: string) => {
  return syncPriceHistories({
    families: Object.values(coinFamiliesMap),
    currency,
  });
};
