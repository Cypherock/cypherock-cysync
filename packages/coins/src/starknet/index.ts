import coinList from './coins';

import { ICoinInfo, coinFamiliesMap } from '../types';

type StarknetFamily = typeof coinFamiliesMap.starknet;

export interface IStarknetCoinInfo extends ICoinInfo {
  family: StarknetFamily;
  network: string;
  argentXClassHash: string;
}

export const StarknetIdMap = {
  starknet: 'starknet',
} as const;

export type StarknetId = (typeof StarknetIdMap)[keyof typeof StarknetIdMap];

export const starknetCoinList: Record<string, IStarknetCoinInfo> =
  coinList.reduce<Record<string, IStarknetCoinInfo>>(
    (list, coin) => ({
      ...list,
      [coin.id as StarknetId]: {
        family: coinFamiliesMap.starknet,
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
        argentXClassHash: coin.argentXClassHash,
      },
    }),
    {},
  );
