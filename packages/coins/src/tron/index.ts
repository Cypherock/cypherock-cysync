import coinList from './coins';

import { ICoinInfo, coinFamiliesMap } from '../types';

type TronFamily = typeof coinFamiliesMap.tron;

export interface ITronCoinInfo extends ICoinInfo {
  family: TronFamily;
  apiCoinType: string;
}

export const TronIdMap = {
  tron: 'tron',
} as const;

export type TronId = (typeof TronIdMap)[keyof typeof TronIdMap];

export const tronCoinList: Record<string, ITronCoinInfo> = coinList.reduce<
  Record<string, ITronCoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id as TronId]: {
      family: coinFamiliesMap.tron,
      id: coin.id,
      name: coin.name,
      abbr: coin.abbr,
      isTest: coin.isTest,
      coinGeckoId: coin.coinGeckoId,
      coinIndex: coin.coinIndex,
      feesUnit: coin.feesUnit,
      apiCoinType: coin.apiCoinType,
      units: coin.units,
      color: coin.color,
    },
  }),
  {},
);
