import { getAssetOrUndefined } from '@cypherock/coin-support-utils';
import {
  coinFamiliesMap,
  CoinFamily,
  createErc20AssetId,
  createSplAssetId,
  createTrc20AssetId,
} from '@cypherock/coins';
import { AccountTypeMap, IDatabase } from '@cypherock/db-interfaces';

type TokenFamilyId = Extract<CoinFamily, 'evm' | 'solana' | 'tron'>;

export interface TokenDetailsChangeItem {
  id: string;
  platform: string;
  version?: string;
}

const createAssetId = (familyId: TokenFamilyId) => {
  switch (familyId) {
    case coinFamiliesMap.solana:
      return createSplAssetId;

    case coinFamiliesMap.tron:
      return createTrc20AssetId;

    case coinFamiliesMap.evm:
      return createErc20AssetId;

    default:
      throw new Error(`Unsupported familyId: ${familyId}`);
  }
};

const createTokenChangeMap = (
  coinChanges: TokenDetailsChangeItem[],
  familyId: TokenFamilyId,
) => {
  const map: Record<string, TokenDetailsChangeItem | undefined> = {};

  for (const change of coinChanges) {
    const id = createAssetId(familyId)({
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
  familyId: TokenFamilyId = coinFamiliesMap.evm,
) => {
  const allItems = await db.account.getAll({
    familyId,
    type: AccountTypeMap.subAccount,
  });
  const changedCoinsMap = createTokenChangeMap(changedCoins, familyId);

  for (const item of allItems) {
    const asset = getAssetOrUndefined(item.parentAssetId, item.assetId);

    if (!asset) continue;

    if (changedCoinsMap[item.assetId]) {
      await db.account.update({ __id: item.__id }, { name: asset.name });
    }
  }
};
