import coinList from './coins';
import { getXrpTokens, IXrpToken } from './token';

import { ICoinInfo, coinFamiliesMap } from '../types';

export * from './token';

type XrpFamily = typeof coinFamiliesMap.xrp;

export interface IXrpCoinInfo extends ICoinInfo {
  family: XrpFamily;
  network: string;
  tokens: Record<string, IXrpToken>;
  tokensByContract: Record<string, IXrpToken>;
}

export const XrpIdMap = {
  xrp: 'xrp',
} as const;

export type XrpId = (typeof XrpIdMap)[keyof typeof XrpIdMap];

export const xrpCoinList: Record<string, IXrpCoinInfo> = coinList.reduce<
  Record<string, IXrpCoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id as XrpId]: {
      family: coinFamiliesMap.xrp,
      id: coin.id,
      name: coin.name,
      abbr: coin.abbr,
      isTest: coin.isTest,
      coinGeckoId: coin.coinGeckoId,
      coinIndex: coin.coinIndex,
      feesUnit: coin.feesUnit,
      network: coin.network,
      units: coin.units,
      color: coin.color,
      ...getXrpTokens(coin.id, { color: coin.color }),
    },
  }),
  {},
);
