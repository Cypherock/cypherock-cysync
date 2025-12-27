import coinList from './coins';

import { ICoinInfo, coinFamiliesMap } from '../types';

type SiaFamily = typeof coinFamiliesMap.sia;

export interface ISiaCoinInfo extends ICoinInfo {
  family: SiaFamily;
  network: string;
}

export const SiaIdMap = {
  sia: 'sia',
} as const;

export type SiaId = (typeof SiaIdMap)[keyof typeof SiaIdMap];

export const siaCoinList: Record<string, ISiaCoinInfo> = coinList.reduce<
  Record<string, ISiaCoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id as SiaId]: {
      family: coinFamiliesMap.sia,
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
