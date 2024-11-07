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
    // TODO: this should be fetched from an api eventually and shouldn't be present in coins package
    reserveXrp: '10000000', // in drops
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
