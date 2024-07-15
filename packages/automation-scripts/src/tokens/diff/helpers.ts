import {
  CoingeckoCoinListItem,
  TokenAutomationParams,
  TokenListItem,
} from '../types';

export const createContractMapFromExistingList = (
  params: TokenAutomationParams,
) => {
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

export const createContractMapFromCoingeckoList = (
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

export const verifyDuplicateIds = (
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
