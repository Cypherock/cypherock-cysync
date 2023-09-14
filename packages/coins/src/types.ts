export interface ICoinUnit {
  name: string;
  abbr: string;
  magnitude: number;
}

export const coinFamiliesMap = {
  bitcoin: 'bitcoin',
  evm: 'evm',
  near: 'near',
  solana: 'solana',
} as const;

export type CoinFamily = (typeof coinFamiliesMap)[keyof typeof coinFamiliesMap];

export interface ICoinInfo {
  id: string;
  name: string;
  abbr: string;
  isTest: boolean;
  coinGeckoId: string;
  coinIndex: string;
  feesUnit: string;
  family: string;
  color?: string;
  units: ICoinUnit[];
}
