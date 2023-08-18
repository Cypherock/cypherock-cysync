import { ISyncPricesParams } from '@cypherock/coin-support-interfaces';
import { createSyncPricesObservable } from '@cypherock/coin-support-utils';
import { coinFamiliesMap } from '@cypherock/coins';
import { IDatabase } from '@cypherock/db-interfaces';
import lodash from 'lodash';

const getCoinIds = async (db: IDatabase) => {
  const accounts = await db.account.getAll({
    familyId: coinFamiliesMap.evm,
  });
  const assetList = accounts.map(account => account.assetId);

  return lodash.uniq(assetList);
};

export const syncPrices = (params: ISyncPricesParams) =>
  createSyncPricesObservable({
    ...params,
    getCoinIds,
  });
