const { coinFamiliesMap } = require('@cypherock/coins');
const {
  syncPriceHistories: syncPriceHistoriesCore,
  ISyncPriceHistoriesEvent,
} = require('@cypherock/cysync-core-services');
import { Observer } from 'rxjs';

import { getDB } from '@/utils';

export const syncPriceHistories = ({ families }: { families: string[] }) =>
  new Promise<void>(resolve => {
    const observer: Observer<ISyncPriceHistoriesEvent> = {
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
    }).subscribe(observer);
  });

export const syncAllPriceHistories = async () => {
  return syncPriceHistories({ families: Object.values(coinFamiliesMap) });
};
