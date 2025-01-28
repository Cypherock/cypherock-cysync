import coinList from './coins';
import { ISolanaSplToken, getSplTokens } from './token';

import { coinFamiliesMap, ICoinInfo, ICoinUnit } from '../types';

export * from './token';

type SolanaFamily = typeof coinFamiliesMap.solana;

export interface ISolanaCoinInfo extends ICoinInfo {
  family: SolanaFamily;
  network: string;
  curve: string;
  tokens: Record<string, ISolanaSplToken>;
  tokensByContract: Record<string, ISolanaSplToken>;
}

export const SolanaIdMap = {
  solana: 'solana',
} as const;

export type SolanaId = (typeof SolanaIdMap)[keyof typeof SolanaIdMap] | string;

const units: ICoinUnit[] = [
  {
    name: 'SOL',
    abbr: 'SOL',
    magnitude: 9,
  },
  {
    name: 'lamports',
    abbr: 'lamports',
    magnitude: 0,
  },
];

export const solanaCoinList: Record<string, ISolanaCoinInfo> = coinList.reduce<
  Record<string, ISolanaCoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id]: {
      family: coinFamiliesMap.solana,
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
      ...getSplTokens(coin.id, { color: coin.color }),
    },
  }),
  {},
);
