import { ISyncPriceHistoriesParams } from '@cypherock/coin-support-interfaces';

import { GetCoinIds } from '../syncPrices';

export interface ICreateSyncPriceHistoriesObservableParams
  extends ISyncPriceHistoriesParams {
  getCoinIds: GetCoinIds;
}
