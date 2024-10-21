import { ISyncPriceHistoriesParams } from '@cypherock/coin-support-interfaces';
import { createSyncPriceHistoriesObservable } from '@cypherock/coin-support-utils';

import { getCoinIds } from '../../utils';

export const syncPriceHistories = (params: ISyncPriceHistoriesParams) =>
  createSyncPriceHistoriesObservable({
    ...params,
    getCoinIds,
  });
