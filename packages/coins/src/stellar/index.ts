import coinList from './coins';

import { ICoinInfo, coinFamiliesMap } from '../types';

type StellarFamily = typeof coinFamiliesMap.stellar;

export interface IStellarCoinInfo extends ICoinInfo {
  family: StellarFamily;
  network: string;
}

export const StellarIdMap = {
  stellar: 'stellar',
} as const;

export type StellarId = (typeof StellarIdMap)[keyof typeof StellarIdMap];

export const stellarCoinList: Record<string, IStellarCoinInfo> =
  coinList.reduce<Record<string, IStellarCoinInfo>>(
    (list, coin) => ({
      ...list,
      [coin.id as StellarId]: {
        family: coinFamiliesMap.stellar,
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
      },
    }),
    {},
  );
