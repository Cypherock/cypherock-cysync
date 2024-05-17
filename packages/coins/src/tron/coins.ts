import { ITronCoinInfo } from '.';

const coinList: ITronCoinInfo[] = [
  {
    id: 'tron',
    abbr: 'TRX',
    name: 'Tron',
    isTest: false,
    coinGeckoId: 'tron',
    coinIndex: '800000c3',
    feesUnit: 'sun/byte',
    apiCoinType: 'trx',
    color: '#eb0029',
    family: 'tron',
    isUnderDevelopment: true,
    isZeroPriceCoin: false,
    units: [
      {
        name: 'tron',
        abbr: 'TRX',
        magnitude: 6,
      },
      {
        name: 'sun',
        abbr: 'SUN',
        magnitude: 0,
      },
    ],
  },
];

export default coinList;
