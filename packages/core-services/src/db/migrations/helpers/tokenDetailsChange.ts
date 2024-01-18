import { getAsset } from '@cypherock/coin-support-utils';
import { coinFamiliesMap, createErc20AssetId } from '@cypherock/coins';
import { AccountTypeMap, IDatabase } from '@cypherock/db-interfaces';

export interface TokenDetailsChangeItem {
  id: string;
  platform: string;
  version?: string;
}

const createTokenChangeMap = (coinChanges: TokenDetailsChangeItem[]) => {
  const map: Record<string, TokenDetailsChangeItem | undefined> = {};

  for (const change of coinChanges) {
    const id = createErc20AssetId({
      parentAssetId: change.platform,
      assetId: change.id,
      version: change.version,
    });

    map[id] = change;
  }

  return map;
};

export const migrateTokenDetailsChangeInDb = async (
  db: IDatabase,
  changedCoins: TokenDetailsChangeItem[],
) => {
  const allItems = await db.account.getAll({
    familyId: coinFamiliesMap.evm,
    type: AccountTypeMap.subAccount,
  });
  const changedCoinsMap = createTokenChangeMap(changedCoins);

  for (const item of allItems) {
    const asset = getAsset(item.parentAssetId, item.assetId);

    if (changedCoinsMap[item.assetId]) {
      await db.account.update({ __id: item.__id }, { name: asset.name });
    }
  }
};
