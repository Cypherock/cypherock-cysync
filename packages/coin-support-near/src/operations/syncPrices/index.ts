import { ISyncPricesParams } from '@cypherock/coin-support-interfaces';
import { createSyncPricesObservable } from '@cypherock/coin-support-utils';

import { getCoinIds } from '../../utils';

export const syncPrices = (params: ISyncPricesParams) =>
  createSyncPricesObservable({
    ...params,
    getCoinIds,
  });
