import splList from './spl.json';

import { coinFamiliesMap, ICoinInfo, ICoinUnit } from '../types';

export { default as splJsonList } from './spl.json';

export interface ISolanaSplToken extends ICoinInfo {
  parentId: string;
  address: string;
}

const units: ICoinUnit[] = [
  {
    name: 'SOL',
    abbr: 'SOL',
    magnitude: 9,
  },
  {
    name: 'lamports',
    abbr: 'lamports',
    magnitude: 0,
  },
];

export const createSplAssetId = (params: {
  parentAssetId: string;
  assetId: string;
  version?: string;
}) => {
  const { assetId, parentAssetId, version } = params;

  return `${parentAssetId}:${assetId}${version ? `|${version}` : ''}`;
};

export const getSplTokens = (
  parentId: string,
  parentCoinInfo: { color: string },
) => {
  const tokensById: Record<string, ISolanaSplToken> = {};
  const tokensByContract: Record<string, ISolanaSplToken> = {};
  const tokensList: any = splList;

  for (const token of tokensList) {
    if (token.symbol.length <= 16 && token.platforms[parentId]) {
      if (
        !token.platforms[parentId].contract_address ||
        [null, undefined].includes(token.platforms[parentId].decimal_place)
      ) {
        throw new Error('Missing token data');
      }

      const id = createSplAssetId({
        parentAssetId: parentId,
        assetId: token.id,
        version: token.version,
      });
      const tokenObj: ISolanaSplToken = {
        id,
        parentId,
        name: token.name,
        abbr: token.symbol.toUpperCase(),
        coinGeckoId: token.id,
        address: token.platforms[parentId].contract_address,
        coinIndex: '',
        feesUnit: 'SOL',
        family: coinFamiliesMap.solana,
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

export const splAbi = [
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
];
