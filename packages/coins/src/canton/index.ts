import coinList from './coins';
import { getCantonTokens, ICantonToken } from './token';

import { ICoinInfo, coinFamiliesMap } from '../types';

export * from './token';

type CantonFamily = typeof coinFamiliesMap.canton;

export interface ICantonCoinInfo extends ICoinInfo {
  family: CantonFamily;
  network: string;
  instrument: {
    id: string;
    admin: string;
  };
  decimals: number;
  tokens: Record<string, ICantonToken>;
  tokensByContract: Record<string, ICantonToken>;
}

export const CantonIdMap = {
  canton: 'canton',
} as const;

export type CantonId = (typeof CantonIdMap)[keyof typeof CantonIdMap];

export const cantonCoinList: Record<string, ICantonCoinInfo> = coinList.reduce<
  Record<string, ICantonCoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id as CantonId]: {
      family: coinFamiliesMap.canton,
      id: coin.id,
      name: coin.name,
      abbr: coin.abbr,
      isTest: coin.isTest,
      coinGeckoId: coin.coinGeckoId,
      coinIndex: coin.coinIndex,
      feesUnit: coin.feesUnit,
      decimals: coin.decimals,
      network: coin.network,
      units: coin.units,
      color: coin.color,
      instrument: coin.instrument,
      ...getCantonTokens(coin.id, { color: coin.color }),
    },
  }),
  {},
);
