import { ICoinInfo, ICoinUnit } from '../types';
import coinList from './coins.json';

export interface ISolanaCoinInfo extends ICoinInfo {
  family: 'solana';
  network: string;
  curve: string;
}

export const SolanaIdMap = {
  solana: 'solana',
} as const;

export type SolanaIds = (typeof SolanaIdMap)[keyof typeof SolanaIdMap] | string;

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

export const solanaCoinList: Record<SolanaIds, ISolanaCoinInfo> = coinList.reduce(
  (list, coin) => ({
    ...list,
    [coin.id]: {
      family: 'solana',
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
  {} as Record<SolanaIds, ISolanaCoinInfo>,
);
