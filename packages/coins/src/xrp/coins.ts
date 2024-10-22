export default [
  {
    id: 'xrp',
    abbr: 'XRP',
    name: 'XRP',
    isTest: false,
    coinGeckoId: 'ripple',
    coinIndex: '80000090',
    feesUnit: 'XRP',
    color: '#FFFFFF',
    family: 'xrp',
    network: 'mainnet',
    isUnderDevelopment: true,
    isZeroPriceCoin: false,
    reserveXrp: '10000000', // drops
    units: [
      {
        name: 'xrp',
        abbr: 'XRP',
        magnitude: 6,
      },
      {
        name: 'drop',
        abbr: 'drop',
        magnitude: 0,
      },
    ],
  },
];
