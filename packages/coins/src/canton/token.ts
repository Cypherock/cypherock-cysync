import instrumentList from './instruments.json';

import { coinFamiliesMap, ICoinInfo } from '../types';

export { default as cantonInstrumentsJsonList } from './instruments.json';

export interface ICantonToken extends ICoinInfo {
  parentId: string;
  address: string;
  instrument: {
    id: string;
    admin: string;
  };
}

export const createCantonInstrumentAssetId = (params: {
  parentAssetId: string;
  assetId: string;
  version?: string;
}) => {
  const { assetId, parentAssetId, version } = params;

  return `${parentAssetId}:${assetId}${version ? `|${version}` : ''}`;
};

export const getCantonTokens = (
  parentId: string,
  parentCoinInfo: { color: string },
) => {
  const tokensById: Record<string, ICantonToken> = {};
  const tokensByContract: Record<string, ICantonToken> = {};
  const tokensList: any = instrumentList;

  for (const token of tokensList) {
    if (token.symbol.length <= 16 && token.platforms[parentId]) {
      if (
        !token.platforms[parentId].instrument?.id ||
        !token.platforms[parentId].instrument?.admin
      ) {
        throw new Error('Missing token data');
      }

      const id = createCantonInstrumentAssetId({
        parentAssetId: parentId,
        assetId: token.id,
        version: token.version,
      });
      const tokenObj: ICantonToken = {
        id,
        parentId,
        name: token.name,
        abbr: token.symbol.toUpperCase(),
        coinGeckoId: 'bitcoin',
        address: token.platforms[parentId].instrument.admin,
        instrument: token.platforms[parentId].instrument,
        coinIndex: '',
        feesUnit: token.symbol.toUpperCase(),
        family: coinFamiliesMap.canton,
        isTest: false,
        isZeroPriceCoin: Boolean(token.is_zero_value_coin),
        units: [
          {
            name: token.name,
            abbr: token.symbol.toUpperCase(),
            magnitude: 0,
          },
        ],
        color: parentCoinInfo.color,
      };
      tokensById[id] = tokenObj;
      tokensByContract[tokenObj.address.toLowerCase()] = tokenObj;
    }
  }

  return { tokens: tokensById, tokensByContract };
};
