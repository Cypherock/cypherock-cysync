import { ICoinInfo, ICoinUnit } from '../types';
import coinList from './coins.json';

export interface IBtcCoinInfo extends ICoinInfo {
  family: 'bitcoin';
}

export const BtcIdMap = {
  bitcoin: 'bitcoin',
  dash: 'dash',
  dogecoin: 'dogecoin',
  litecoin: 'litecoin',
} as const;

export type BtcIds = (typeof BtcIdMap)[keyof typeof BtcIdMap] | string;

const units: ICoinUnit[] = [
  {
    name: 'bitcoin',
    abbr: 'BTC',
    magnitude: 8,
  },
  {
    name: 'mBTC',
    abbr: 'mBTC',
    magnitude: 5,
  },
  {
    name: 'bit',
    abbr: 'bit',
    magnitude: 2,
  },
  {
    name: 'satoshi',
    abbr: 'sat',
    magnitude: 0,
  },
];

export const btcCoinList: Record<BtcIds, IBtcCoinInfo> = coinList.reduce(
  (list, coin) => ({
    ...list,
    [coin.id]: {
      family: 'bitcoin',
      id: coin.id,
      name: coin.name,
      isTest: coin.isTest,
      coinGeckoId: coin.coinGeckoId,
      coinIndex: coin.coinIndex,
      feesUnit: coin.feesUnit,
      units,
    },
  }),
  {} as Record<BtcIds, IBtcCoinInfo>,
);
