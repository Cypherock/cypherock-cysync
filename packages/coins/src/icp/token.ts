import icrcList from './icrc.json';

import { coinFamiliesMap, ICoinInfo, ICoinUnit } from '../types';

export { default as icrcJsonList } from './icrc.json';

export interface IIcpIcrcToken extends ICoinInfo {
  parentId: string;
  address: string;
  decimals: number;
  dashboardRoute: string;
  canisters: {
    ledger: string;
    index: string;
  };
}

const units: ICoinUnit[] = [
  {
    name: 'icp',
    abbr: 'ICP',
    magnitude: 8,
  },
  {
    name: 'e8s',
    abbr: 'e8s',
    magnitude: 0,
  },
];

export const createIcrcAssetId = (params: {
  parentAssetId: string;
  assetId: string;
  version?: string;
}) => {
  const { assetId, parentAssetId, version } = params;

  return `${parentAssetId}:${assetId}${version ? `|${version}` : ''}`;
};

export const getIcrcTokens = (
  parentId: string,
  parentCoinInfo: { color: string },
) => {
  const tokensById: Record<string, IIcpIcrcToken> = {};
  const tokensByContract: Record<string, IIcpIcrcToken> = {};
  const tokensList: any = icrcList;

  for (const token of tokensList) {
    if (token.symbol.length <= 16 && token.platforms[parentId]) {
      if (
        !token.platforms[parentId].contract_address ||
        [null, undefined].includes(token.platforms[parentId].decimal_place) ||
        !token.platforms[parentId].dashboard_route ||
        !token.platforms[parentId].canisters ||
        !token.platforms[parentId].canisters.ledger ||
        !token.platforms[parentId].canisters.index
      ) {
        throw new Error('Missing token data');
      }

      const id = createIcrcAssetId({
        parentAssetId: parentId,
        assetId: token.id,
        version: token.version,
      });
      const tokenObj: IIcpIcrcToken = {
        id,
        parentId,
        name: token.name,
        abbr: token.symbol.toUpperCase(),
        coinGeckoId: token.id,
        address: token.platforms[parentId].contract_address,
        canisters: token.platforms[parentId].canisters,
        decimals: token.platforms[parentId].decimal_place,
        dashboardRoute: token.platforms[parentId].dashboard_route,
        coinIndex: '',
        feesUnit: token.symbol.toUpperCase(),
        family: coinFamiliesMap.icp,
        isTest: false,
        isZeroPriceCoin: Boolean(token.is_zero_value_coin),
        units: [
          {
            name: token.name,
            abbr: token.symbol.toUpperCase(),
            magnitude: token.platforms[parentId].decimal_place,
          },
          ...units,
        ],
        color: parentCoinInfo.color,
      };
      tokensById[id] = tokenObj;
      tokensByContract[tokenObj.address.toLowerCase()] = tokenObj;
    }
  }

  return { tokens: tokensById, tokensByContract };
};
