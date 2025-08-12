import { coinFamiliesMap } from '@cypherock/coins';
import {
  syncPriceHistories as syncPriceHistoriesCore,
  ISyncPriceHistoriesEvent,
} from '@cypherock/cysync-core-services';
import { Observer } from 'rxjs';

import { getDB } from '~/utils';

export const syncPriceHistories = ({
  families,
  currency,
}: {
  families: string[];
  currency: string;
}) =>
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
      currency,
    }).subscribe(observer);
  });

export const syncAllPriceHistories = (currency: string) =>
  syncPriceHistories({ families: Object.values(coinFamiliesMap), currency });
