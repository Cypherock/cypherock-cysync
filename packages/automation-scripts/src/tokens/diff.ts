import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import lodash from 'lodash';

import { getCoingeckoCoinList } from './coingecko';
import {
  CoingeckoCoinListItem,
  TokenAutomationParams,
  TokenListItem,
} from './types';

import { config } from '../config';

const createContractMapFromExistingList = (params: TokenAutomationParams) => {
  const map: Record<string, TokenListItem | undefined> = {};

  for (const coin of params.tokenJsonList) {
    if (!coin.platforms) continue;

    for (const platform in coin.platforms) {
      if (!coin.platforms[platform]) continue;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!params.coinList[platform]) continue;

      const tokenDetails = coin.platforms[platform];
      if (!tokenDetails) continue;

      map[`${platform}:${tokenDetails.contract_address.toLowerCase()}`] = {
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

const createContractMapFromCoingeckoList = (
  list: CoingeckoCoinListItem[],
  params: TokenAutomationParams,
) => {
  const map: Record<string, TokenListItem | undefined> = {};

  for (const coin of list) {
    if (!coin.platforms) continue;

    for (const platform in coin.platforms) {
      if (!coin.platforms[platform]) continue;

      const mappedPlatform = params.coingeckoPlatformMapping[platform];
      if (!mappedPlatform) continue;

      const contractAddress = coin.platforms[platform];
      if (!contractAddress) continue;

      map[`${mappedPlatform}:${contractAddress.toLowerCase()}`] = {
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
  coingeckoCoinMap: Record<string, TokenListItem | undefined>;
  existingCoinMap: Record<string, TokenListItem | undefined>;
}) => {
  const { sameContracts, coingeckoCoinMap, existingCoinMap } = params;
  const changedContracts: string[] = [];
  const changedCoinList: TokenListItem[] = [];
  const idChanges: {
    oldId: string;
    oldVersion?: string;
    newId: string;
    platform: string;
  }[] = [];
  const changedCoins: {
    id: string;
    platform: string;
    version?: string;
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
      const version =
        coingeckoCoin.id === existingCoin.id ? existingCoin.version : undefined;
      changedContracts.push(contractAddress);

      changedCoinList.push({
        ...coingeckoCoin,
        version,
      });

      if (coingeckoCoin.id !== existingCoin.id) {
        idChanges.push({
          oldId: existingCoin.id,
          oldVersion: existingCoin.version,
          newId: coingeckoCoin.id,
          platform: Object.keys(existingCoin.platforms ?? {})[0],
        });
      }

      changedCoins.push({
        id: coingeckoCoin.id,
        platform: Object.keys(existingCoin.platforms ?? {})[0],
        version,
      });
    }
  }

  const unchangedCoinList = lodash
    .difference(sameContracts, changedContracts)
    .map(e => existingCoinMap[e])
    .filter(e => !!e) as TokenListItem[];

  return {
    changedContracts,
    changedCoinList,
    changedCoins,
    idChanges,
    unchangedCoinList,
  };
};

const getRemovedContracts = (params: {
  removedContracts: string[];
  coingeckoCoinMap: Record<string, TokenListItem | undefined>;
  existingCoinMap: Record<string, TokenListItem | undefined>;
}) => {
  const { removedContracts, existingCoinMap } = params;
  const removedCoinList: TokenListItem[] = [];

  for (const contractAddress of removedContracts) {
    const existingCoin = existingCoinMap[contractAddress];

    if (!existingCoin) continue;

    if (existingCoin.is_custom_coin) {
      removedCoinList.push({
        ...existingCoin,
      });
    } else {
      removedCoinList.push({
        ...existingCoin,
        is_zero_value_coin: true,
      });
    }
  }

  return { removedCoinList };
};

const verifyDuplicateIds = (
  list: TokenListItem[],
  params: TokenAutomationParams,
) => {
  const idSet = new Set();
  const duplicateIdList: string[] = [];

  for (const coin of list) {
    if (!coin.platforms) continue;

    for (const platform in coin.platforms) {
      if (!coin.platforms[platform]) continue;

      const tokenDetails = coin.platforms[platform];
      if (!tokenDetails) continue;

      const id = params.createTokenAssetId({
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

  if (duplicateIdList.length > 0) {
    throw new Error(
      `Duplicate ids found in list: ${duplicateIdList.join(',')}`,
    );
  }
};

const getAddedContracts = (params: {
  addedContracts: string[];
  coingeckoCoinMap: Record<string, TokenListItem | undefined>;
  existingCoinMap: Record<string, TokenListItem | undefined>;
}) => {
  const { addedContracts, coingeckoCoinMap, existingCoinMap } = params;
  const addedCoinList: TokenListItem[] = [];

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

export const getTokenDifference = async (
  params: TokenAutomationParams,
  dontSaveToFile?: boolean,
) => {
  const coingeckoCoinMap = createContractMapFromCoingeckoList(
    await getCoingeckoCoinList(),
    params,
  );
  const existingCoinMap = createContractMapFromExistingList(params);

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

  const {
    changedContracts,
    idChanges,
    changedCoins,
    changedCoinList,
    unchangedCoinList,
  } = getChangedContracts({
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

  verifyDuplicateIds(newCoinList, params);

  if (!dontSaveToFile) {
    await fs.promises.writeFile(
      path.join(config.DATA_FOLDER, `${params.filePrefix}-diff.json`),
      JSON.stringify(
        {
          removedContracts: removedContracts.length,
          addedContracts: addedContracts.length,
          sameContracts: sameContracts.length,
          changedContracts: changedContracts.length,
          coingeckoContractAddresses: coingeckoContractAddresses.length,
          existingContractAddresses: existingContractAddresses.length,
          idChanges,
          changedCoins,
          removedCoinList,
          changedCoinList,
          addedCoinList,
          unchangedCoinList,
          newCoinList,
        },
        undefined,
        2,
      ),
    );
  }

  return newCoinList;
};
