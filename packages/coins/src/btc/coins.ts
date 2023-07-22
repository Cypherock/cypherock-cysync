export default [
  {
    id: 'bitcoin',
    abbr: 'btc',
    name: 'Bitcoin',
    isTest: false,
    coinGeckoId: 'bitcoin',
    coinIndex: '80000000',
    feesUnit: 'sat/byte',
    apiCoinType: 'btc',
    units: [
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
    ],
  },
  {
    id: 'litecoin',
    abbr: 'ltc',
    name: 'Litecoin',
    isTest: false,
    coinGeckoId: 'litecoin',
    tokenList: {},
    coinIndex: '80000002',
    feesUnit: 'sat/byte',
    apiCoinType: 'ltc',
    units: [
      {
        name: 'litecoin',
        abbr: 'LTC',
        magnitude: 8,
      },
      {
        name: 'mLTC',
        abbr: 'mLTC',
        magnitude: 5,
      },
      {
        name: 'litoshi',
        abbr: 'litoshi',
        magnitude: 0,
      },
    ],
  },
  {
    id: 'dogecoin',
    abbr: 'doge',
    name: 'Dogecoin',
    isTest: false,
    coinGeckoId: 'dogecoin',
    tokenList: {},
    coinIndex: '80000003',
    feesUnit: 'sat/byte',
    apiCoinType: 'doge',
    units: [
      {
        name: 'dogecoin',
        abbr: 'DOGE',
        magnitude: 8,
      },
      {
        name: 'satoshi',
        abbr: 'sat',
        magnitude: 0,
      },
    ],
  },
  {
    id: 'dash',
    abbr: 'dash',
    name: 'Dash',
    isTest: false,
    coinGeckoId: 'dash',
    tokenList: {},
    coinIndex: '80000005',
    feesUnit: 'sat/byte',
    apiCoinType: 'dash',
    units: [
      {
        name: 'dash',
        abbr: 'DASH',
        magnitude: 8,
      },
      {
        name: 'satoshi',
        abbr: 'sat',
        magnitude: 0,
      },
    ],
  },
];
