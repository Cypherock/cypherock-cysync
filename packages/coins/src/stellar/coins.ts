export default [
  {
    id: 'stellar',
    abbr: 'XLM',
    name: 'Stellar',
    isTest: false,
    coinGeckoId: 'stellar',
    coinIndex: '80000094', // SLIP-0044 index for Stellar
    feesUnit: 'XLM',
    color: '#FFFFFF',
    family: 'stellar',
    network: 'mainnet',
    units: [
      {
        name: 'stellar',
        abbr: 'XLM',
        magnitude: 7,
      },
      {
        name: 'stroop',
        abbr: 'stroop',
        magnitude: 0,
      },
    ],
  },
];
