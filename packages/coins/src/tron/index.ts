import coinList from './coins';
import { ITronTrc20Token, getTrc20Tokens } from './token';

import { ICoinInfo, coinFamiliesMap } from '../types';

export * from './token';

type TronFamily = typeof coinFamiliesMap.tron;

export interface ITronCoinInfo extends ICoinInfo {
  family: TronFamily;
  tokens: Record<string, ITronTrc20Token>;
  tokensByContract: Record<string, ITronTrc20Token>;
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
      units: coin.units,
      color: coin.color,
      ...getTrc20Tokens(coin.id, { color: coin.color }),
    },
  }),
  {},
);
