import { coinFamiliesMap } from '@cypherock/coins';
import {
  syncPrices as syncPricesCore,
  ISyncPricesEvent,
} from '@cypherock/cysync-core-services';
import { Observer } from 'rxjs';

import { getDB } from '~/utils';

export const syncPrices = ({ families }: { families: string[] }) =>
  new Promise<void>(resolve => {
    const observer: Observer<ISyncPricesEvent> = {
      error: () => {
        resolve();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      next: () => {},
      complete: () => {
        resolve();
      },
    };

    syncPricesCore({
      db: getDB(),
      families,
    }).subscribe(observer);
  });

export const syncAllPrices = () =>
  syncPrices({ families: Object.values(coinFamiliesMap) });
