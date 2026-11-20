import xrpList from './xrp.json';

import { coinFamiliesMap, ICoinInfo, ICoinUnit } from '../types';

export { default as xrpJsonList } from './xrp.json';

export interface IXrpToken extends ICoinInfo {
  parentId: string;
  address: string;
  decimals: number;
}

const units: ICoinUnit[] = [
  {
    name: 'xrp',
    abbr: 'XRP',
    magnitude: 6,
  },
  {
    name: 'drop',
    abbr: 'drop',
    magnitude: 0,
  },
];

export const createXrpAssetId = (params: {
  parentAssetId: string;
  assetId: string;
  version?: string;
}) => {
  const { assetId, parentAssetId, version } = params;

  return `${parentAssetId}:${assetId}${version ? `|${version}` : ''}`;
};

const normalizeXrpAddress = (address: string, symbol: string): string => {
  // Already properly formatted with currency.issuer or currency-issuer
  if (address.includes('.') || address.includes('-')) {
    return address;
  }

  // Just an issuer address (starts with 'r' and is ~25-35 chars)
  if (address.startsWith('r') && address.length >= 25) {
    // Convert symbol to hex (padded to 40 chars) + issuer
    const currencyHex = symbol
      .toUpperCase()
      .split('')
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
      .padEnd(40, '0');
    return `${currencyHex}.${address}`;
  }

  return address;
};

export const getXrpTokens = (
  parentId: string,
  parentCoinInfo: { color: string },
) => {
  const tokensById: Record<string, IXrpToken> = {};
  const tokensByContract: Record<string, IXrpToken> = {};
  const tokensList: any = xrpList;

  for (const token of tokensList) {
    if (token.symbol.length <= 16 && token.platforms[parentId]) {
      if (
        !token.platforms[parentId].contract_address ||
        [null, undefined].includes(token.platforms[parentId].decimal_place)
      ) {
        throw new Error('Missing token data');
      }

      const rawAddress = token.platforms[parentId].contract_address;
      const normalizedAddress = normalizeXrpAddress(rawAddress, token.symbol);

      const id = createXrpAssetId({
        parentAssetId: parentId,
        assetId: token.id,
        version: token.version,
      });

      const tokenObj: IXrpToken = {
        id,
        parentId,
        name: token.name,
        abbr: token.symbol.toUpperCase(),
        coinGeckoId: token.id,
        address: normalizedAddress,
        decimals: token.platforms[parentId].decimal_place,
        coinIndex: '',
        feesUnit: 'XRP',
        family: coinFamiliesMap.xrp,
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
      tokensByContract[normalizedAddress.toLowerCase()] = tokenObj;
    }
  }

  return { tokens: tokensById, tokensByContract };
};
