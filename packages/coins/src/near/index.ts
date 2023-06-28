import coinList from './coins';

import { ICoinInfo, ICoinUnit } from '../types';

export interface INearCoinInfo extends ICoinInfo {
  family: 'near';
  network: string;
  curve: string;
}

export const NearIdMap = {
  near: 'near',
} as const;

export type NearIds = (typeof NearIdMap)[keyof typeof NearIdMap] | string;

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

export const nearCoinList: Record<NearIds, INearCoinInfo> = coinList.reduce<
  Record<NearIds, INearCoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id]: {
      family: 'near',
      id: coin.id,
      name: coin.name,
      isTest: coin.isTest,
      coinGeckoId: coin.coinGeckoId,
      coinIndex: coin.coinIndex,
      feesUnit: coin.feesUnit,
      network: coin.network,
      curve: coin.curve,
      units,
    },
  }),
  {},
);
