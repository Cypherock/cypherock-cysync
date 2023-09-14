import { coinFamiliesMap } from '@cypherock/coins';
import { IDatabase } from '@cypherock/db-interfaces';
import lodash from 'lodash';

export const getCoinIds = async (db: IDatabase) => {
  const accounts = await db.account.getAll({
    familyId: coinFamiliesMap.bitcoin,
  });
  const assetList = accounts.map(account => ({
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
  }));

  return lodash.uniq(assetList);
};
