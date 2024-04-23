import coinList from './coins';

import { coinFamiliesMap, ICoinInfo, ICoinUnit } from '../types';

type NearFamily = typeof coinFamiliesMap.near;

export interface INearCoinInfo extends ICoinInfo {
  family: NearFamily;
  network: string;
  curve: string;
}

export const NearIdMap = {
  near: 'near',
} as const;

export type NearId = (typeof NearIdMap)[keyof typeof NearIdMap] | string;

const units: ICoinUnit[] = [
  {
    name: 'NEAR',
    abbr: 'NEAR',
    magnitude: 24,
  },
  {
    name: 'yoctoNEAR',
    abbr: 'yoctoNEAR',
    magnitude: 0,
  },
];

export const nearCoinList: Record<string, INearCoinInfo> = coinList.reduce<
  Record<string, INearCoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id]: {
      family: coinFamiliesMap.near,
      id: coin.id,
      name: coin.name,
      abbr: coin.abbr,
      isTest: coin.isTest,
      coinGeckoId: coin.coinGeckoId,
      coinIndex: coin.coinIndex,
      feesUnit: coin.feesUnit,
      network: coin.network,
      curve: coin.curve,
      color: coin.color,
      units,
      isUnderDevelopment: true,
    },
  }),
  {},
);
