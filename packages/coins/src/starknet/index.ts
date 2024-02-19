import coinList from './coins';

import { coinFamiliesMap, ICoinInfo, ICoinUnit } from '../types';

type StarknetFamily = typeof coinFamiliesMap.starknet;

export interface IStarknetCoinInfo extends ICoinInfo {
  family: StarknetFamily;
  network: string;
  curve: string;
}

export const StarknetIdMap = {
  starknet: 'starknet',
} as const;

export type StarknetId =
  | (typeof StarknetIdMap)[keyof typeof StarknetIdMap]
  | string;

const units: ICoinUnit[] = [
  {
    name: 'Ether',
    abbr: 'ETH',
    magnitude: 18,
  },
  {
    name: 'Gwei',
    abbr: 'Gwei',
    magnitude: 9,
  },
  {
    name: 'Mwei',
    abbr: 'Mwei',
    magnitude: 6,
  },
  {
    name: 'Kwei',
    abbr: 'Kwei',
    magnitude: 3,
  },
  {
    name: 'wei',
    abbr: 'wei',
    magnitude: 0,
  },
];

export const starknetCoinList: Record<string, IStarknetCoinInfo> =
  coinList.reduce<Record<string, IStarknetCoinInfo>>(
    (list, coin) => ({
      ...list,
      [coin.id]: {
        family: coinFamiliesMap.starknet,
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
