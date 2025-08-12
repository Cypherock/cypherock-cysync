import { DEFAULT_CURRENCY } from '@cypherock/coin-support-utils';
import { coinFamiliesMap } from '@cypherock/coins';
import {
  syncPriceHistories as syncPriceHistoriesCore,
  ISyncPriceHistoriesEvent,
} from '@cypherock/cysync-core-services';
import { Observer } from 'rxjs';

import { getDB } from '~/utils';

export const syncPriceHistories = ({
  families,
  currency = DEFAULT_CURRENCY,
}: {
  families: string[];
  currency?: string;
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

export const syncAllPriceHistories = () =>
  syncPriceHistories({
    families: Object.values(coinFamiliesMap),
    currency: DEFAULT_CURRENCY,
  });
