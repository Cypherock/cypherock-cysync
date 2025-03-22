import coinList from './coins';
import { getIcrcTokens, IIcpIcrcToken } from './token';

import { ICoinInfo, coinFamiliesMap } from '../types';

export * from './token';

type IcpFamily = typeof coinFamiliesMap.icp;

export interface IIcpCoinInfo extends ICoinInfo {
  family: IcpFamily;
  network: string;
  tokens: Record<string, IIcpIcrcToken>;
  tokensByContract: Record<string, IIcpIcrcToken>;
}

export const IcpIdMap = {
  icp: 'icp',
} as const;

export type IcpId = (typeof IcpIdMap)[keyof typeof IcpIdMap];

export const icpCoinList: Record<string, IIcpCoinInfo> = coinList.reduce<
  Record<string, IIcpCoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id as IcpId]: {
      family: coinFamiliesMap.icp,
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
      ...getIcrcTokens(coin.id, { color: coin.color }),
    },
  }),
  {},
);
