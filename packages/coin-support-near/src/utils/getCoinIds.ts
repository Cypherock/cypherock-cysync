import { coinFamiliesMap } from '@cypherock/coins';
import { IDatabase } from '@cypherock/db-interfaces';
import lodash from 'lodash';

export const getCoinIds = async (db: IDatabase) => {
  const accounts = await db.account.getAll({
    familyId: coinFamiliesMap.near,
  });
  const assetList = accounts.map(account => ({
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
  }));

  return lodash.uniqWith(
    assetList,
    (a, b) => a.assetId === b.assetId && a.parentAssetId === b.parentAssetId,
  );
};
