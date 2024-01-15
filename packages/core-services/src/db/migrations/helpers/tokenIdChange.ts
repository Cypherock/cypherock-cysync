import { createErc20AssetId } from '@cypherock/coins';
import { IDatabase, IRepository } from '@cypherock/db-interfaces';

export interface TokenIdChangeItem {
  oldId: string;
  oldVersion?: string;
  newId: string;
  newVersion?: string;
  platform: string;
}

const createTokenIdChangesMap = (idChanges: TokenIdChangeItem[]) => {
  const map: Record<string, string | undefined> = {};

  for (const change of idChanges) {
    const existingAssetId = createErc20AssetId({
      parentAssetId: change.platform,
      assetId: change.oldId,
      version: change.oldVersion,
    });
    const newAssetId = createErc20AssetId({
      parentAssetId: change.platform,
      assetId: change.newId,
      version: change.newVersion,
    });

    map[existingAssetId] = newAssetId;
  }

  return map;
};

async function migrateTokenIdChangeInDbRepository<
  T extends IRepository<any>,
>(params: {
  repository: T;
  key: string;
  idChangesMap: Record<string, string | undefined>;
}) {
  const { repository, key, idChangesMap } = params;
  const allItems = await repository.getAll({});

  for (const item of allItems) {
    const existingAssetId = item[key];
    const newAssetId = idChangesMap[existingAssetId];

    if (newAssetId) {
      await repository.update({ __id: item.__id }, { [key]: newAssetId });
    }
  }
}

export const migrateTokenIdChangeInDb = async (
  db: IDatabase,
  idChanges: TokenIdChangeItem[],
) => {
  const map = createTokenIdChangesMap(idChanges);

  const repositories = [
    {
      respository: db.account,
      key: 'assetId',
    },
    {
      respository: db.priceHistory,
      key: 'assetId',
    },
    {
      respository: db.priceInfo,
      key: 'assetId',
    },
    {
      respository: db.transaction,
      key: 'assetId',
    },
  ];

  for (const repository of repositories) {
    await migrateTokenIdChangeInDbRepository({
      repository: repository.respository,
      key: repository.key,
      idChangesMap: map,
    });
  }
};
