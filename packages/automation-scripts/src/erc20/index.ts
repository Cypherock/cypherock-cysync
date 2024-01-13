import crypto from 'crypto';
import fs from 'fs';

import {
  createErc20AssetId,
  erc20JsonList,
  evmCoinList,
} from '@cypherock/coins';
import lodash from 'lodash';

import {
  CoingeckoCoinListItem,
  coingeckoPlatformMapping,
  getCoingeckoCoinList,
} from './coingecko';

export interface Erc20ListItem {
  id: string;
  symbol: string;
  name: string;
  market_cap?: number;
  is_zero_value_coin?: boolean;
  version?: string;
  platforms?: Record<
    string,
    { contract_address: string; decimal_place: number } | undefined
  >;
}

const createContractMapFromExistingList = (list: Erc20ListItem[]) => {
  const map: Record<string, Erc20ListItem | undefined> = {};

  for (const coin of list) {
    if (!coin.platforms) continue;

    for (const platform in coin.platforms) {
      if (!coin.platforms[platform]) continue;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!evmCoinList[platform]) continue;

      const tokenDetails = coin.platforms[platform];
      if (!tokenDetails) continue;

      map[tokenDetails.contract_address] = {
        ...coin,
        platforms: {
          [platform]: {
            ...tokenDetails,
          },
        },
      };
    }
  }

  return map;
};

const createContractMapFromCoingeckoList = (list: CoingeckoCoinListItem[]) => {
  const map: Record<string, Erc20ListItem | undefined> = {};

  for (const coin of list) {
    if (!coin.platforms) continue;

    for (const platform in coin.platforms) {
      if (!coin.platforms[platform]) continue;

      const mappedPlatform = coingeckoPlatformMapping[platform];
      if (!mappedPlatform) continue;

      const contractAddress = coin.platforms[platform];
      if (!contractAddress) continue;

      map[contractAddress] = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        platforms: {
          [mappedPlatform]: {
            contract_address: contractAddress,
            decimal_place: 0,
          },
        },
      };
    }
  }

  return map;
};

const getChangedContracts = (params: {
  sameContracts: string[];
  coingeckoCoinMap: Record<string, Erc20ListItem | undefined>;
  existingCoinMap: Record<string, Erc20ListItem | undefined>;
}) => {
  const { sameContracts, coingeckoCoinMap, existingCoinMap } = params;
  const changedContracts: string[] = [];
  const changedCoinList: Erc20ListItem[] = [];
  const idChanges: {
    oldId: string;
    oldVersion?: string;
    newId: string;
    platform: string;
  }[] = [];

  for (const contractAddress of sameContracts) {
    const coingeckoCoin = coingeckoCoinMap[contractAddress];
    const existingCoin = existingCoinMap[contractAddress];

    if (!coingeckoCoin || !existingCoin) continue;

    if (
      coingeckoCoin.id !== existingCoin.id ||
      coingeckoCoin.name !== existingCoin.name ||
      coingeckoCoin.symbol !== existingCoin.symbol
    ) {
      changedContracts.push(contractAddress);

      changedCoinList.push({
        ...coingeckoCoin,
      });

      if (coingeckoCoin.id !== existingCoin.id) {
        idChanges.push({
          oldId: existingCoin.id,
          oldVersion: existingCoin.version,
          newId: coingeckoCoin.id,
          platform: Object.keys(existingCoin.platforms ?? {})[0],
        });
      }
    }
  }

  const unchangedCoinList = lodash
    .difference(sameContracts, changedContracts)
    .map(e => existingCoinMap[e])
    .filter(e => !!e) as Erc20ListItem[];

  return { changedContracts, changedCoinList, idChanges, unchangedCoinList };
};

const getRemovedContracts = (params: {
  removedContracts: string[];
  coingeckoCoinMap: Record<string, Erc20ListItem | undefined>;
  existingCoinMap: Record<string, Erc20ListItem | undefined>;
}) => {
  const { removedContracts, existingCoinMap } = params;
  const removedCoinList: Erc20ListItem[] = [];

  for (const contractAddress of removedContracts) {
    const existingCoin = existingCoinMap[contractAddress];

    if (!existingCoin) continue;

    removedCoinList.push({
      ...existingCoin,
      is_zero_value_coin: true,
    });
  }

  return { removedCoinList };
};

const verifyDuplicateIds = (list: Erc20ListItem[]) => {
  const idSet = new Set();
  const duplicateIdList: string[] = [];

  for (const coin of list) {
    if (!coin.platforms) continue;

    for (const platform in coin.platforms) {
      if (!coin.platforms[platform]) continue;

      const tokenDetails = coin.platforms[platform];
      if (!tokenDetails) continue;

      const id = createErc20AssetId({
        parentAssetId: platform,
        assetId: coin.id,
        version: coin.version,
      });

      if (idSet.has(id)) {
        duplicateIdList.push(id);
      } else {
        idSet.add(id);
      }
    }
  }

  console.warn(duplicateIdList);
};

const getAddedContracts = (params: {
  addedContracts: string[];
  coingeckoCoinMap: Record<string, Erc20ListItem | undefined>;
  existingCoinMap: Record<string, Erc20ListItem | undefined>;
}) => {
  const { addedContracts, coingeckoCoinMap, existingCoinMap } = params;
  const addedCoinList: Erc20ListItem[] = [];

  for (const contractAddress of addedContracts) {
    const coingeckoCoin = coingeckoCoinMap[contractAddress];

    if (!coingeckoCoin) continue;

    const existingCoinWithSameId = Object.values(existingCoinMap).find(
      e =>
        e &&
        e.id === coingeckoCoin.id &&
        Object.keys(e.platforms ?? {})[0] ===
          Object.keys(coingeckoCoin.platforms ?? {})[0],
    );

    const newCoin = {
      ...coingeckoCoin,
    };

    if (existingCoinWithSameId) {
      const hash = crypto
        .createHash('sha256')
        .update(contractAddress)
        .digest('hex');

      newCoin.version = hash.slice(0, 8);
    }

    addedCoinList.push(newCoin);
  }

  return { addedCoinList };
};

export const getERC20TokenDifference = async () => {
  const coingeckoCoinMap = createContractMapFromCoingeckoList(
    await getCoingeckoCoinList(),
  );
  const existingCoinMap = createContractMapFromExistingList(
    erc20JsonList as any,
  );

  const coingeckoContractAddresses = Object.keys(coingeckoCoinMap);
  const existingContractAddresses = Object.keys(existingCoinMap);

  const removedContracts = lodash.difference(
    existingContractAddresses,
    coingeckoContractAddresses,
  );
  const addedContracts = lodash.difference(
    coingeckoContractAddresses,
    existingContractAddresses,
  );
  const sameContracts = lodash.intersection(
    coingeckoContractAddresses,
    existingContractAddresses,
  );

  const { changedContracts, idChanges, changedCoinList, unchangedCoinList } =
    getChangedContracts({
      sameContracts,
      coingeckoCoinMap,
      existingCoinMap,
    });

  const { removedCoinList } = getRemovedContracts({
    removedContracts,
    coingeckoCoinMap,
    existingCoinMap,
  });

  const { addedCoinList } = getAddedContracts({
    addedContracts,
    coingeckoCoinMap,
    existingCoinMap,
  });

  const newCoinList = [
    ...unchangedCoinList,
    ...addedCoinList,
    ...changedCoinList,
    ...removedCoinList,
  ];

  verifyDuplicateIds(newCoinList);

  await fs.promises.writeFile(
    'erc20.json',
    JSON.stringify(newCoinList, undefined, 2),
  );

  await fs.promises.writeFile(
    'data.json',
    JSON.stringify(
      {
        removedContracts: removedContracts.length,
        addedContracts: addedContracts.length,
        sameContracts: sameContracts.length,
        changedContracts: changedContracts.length,
        coingeckoContractAddresses: coingeckoContractAddresses.length,
        existingContractAddresses: existingContractAddresses.length,
        removedCoinList,
        idChanges,
        newCoinList: changedCoinList,
        addedCoinList,
        unchangedContracts: unchangedCoinList,
      },
      undefined,
      2,
    ),
  );
};
