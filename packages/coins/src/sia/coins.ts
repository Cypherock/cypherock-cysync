export default [
  {
    id: 'sia',
    abbr: 'SC',
    name: 'Sia',
    isTest: false,
    coinGeckoId: 'siacoin',
    coinIndex: '800007c7', // 1991 + 0x80000000 in hex
    feesUnit: 'SC',
    color: '#00CDA7', // Sia's teal color
    family: 'sia',
    network: 'mainnet',
    units: [
      {
        name: 'Siacoin',
        abbr: 'SC',
        magnitude: 24,
      },
      {
        name: 'hastings',
        abbr: 'hastings',
        magnitude: 0,
      },
    ],
  },
];
