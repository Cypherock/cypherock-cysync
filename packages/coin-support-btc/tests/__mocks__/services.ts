import { jest } from '@jest/globals';

export const getXpubDetails = jest
  .fn()
  .mockReturnValue(Promise.resolve({ balance: '0', txs: 0 }));

export const getDerivedAddresses = jest.fn().mockReturnValue(
  Promise.resolve({
    address:
      'tpubDDYcLPSnp4JVjnTdTUC43LMLDWshar5tW9uKcVwdhaTNhJFrQzKvHFEALwoVh4sbEpn5LR9mFvhQo6QkJMFv4E88LcmCPNpYDeqTMzDLZJX',
    balance: '18956',
    totalReceived: '18956',
    totalSent: '0',
    unconfirmedBalance: '0',
    unconfirmedTxs: 0,
    txs: 2,
    usedTokens: 2,
    tokens: [
      {
        type: 'XPUBAddress',
        name: 'mj9w9asnqcjfKM2aphTXMc7uhHR2Y1Levu',
        path: "m/44'/1'/0'/0/0",
        transfers: 1,
        decimals: 8,
      },
      {
        type: 'XPUBAddress',
        name: 'mghcTmbVZSGsQwvCi5u3aZnddDUeYfrafd',
        path: "m/44'/1'/0'/0/1",
        transfers: 1,
        decimals: 8,
      },
      {
        type: 'XPUBAddress',
        name: 'mg3vuEjS6tu8tUys6LL2fuSG3gbXyx2Z3b',
        path: "m/44'/1'/0'/0/2",
        transfers: 0,
        decimals: 8,
      },
      {
        type: 'XPUBAddress',
        name: 'mnNh1JHmjhaih8BdeJnGWgxo9y6wBEUcvz',
        path: "m/44'/1'/0'/1/0",
        transfers: 0,
        decimals: 8,
      },
      {
        type: 'XPUBAddress',
        name: 'mu2wd9xnqqiSGCh93NyUwrLnynCFMkUZoe',
        path: "m/44'/1'/0'/1/1",
        transfers: 0,
        decimals: 8,
      },
    ],
  }),
);

export const getAverageFee = jest.fn().mockReturnValue(Promise.resolve(0));

export const getUtxos = jest.fn().mockReturnValue(Promise.resolve([]));

export const getFirstUnusedAddress = jest.fn().mockReturnValue(
  Promise.resolve({
    address: 'mg3vuEjS6tu8tUys6LL2fuSG3gbXyx2Z3b',
    derivationPath: "m/44'/1'/0'/0/2",
  }),
);

export const broadcastTransactionToBlockchain = jest
  .fn()
  .mockReturnValue(Promise.resolve(''));

jest.mock('../../src/services', () => ({
  __esModule: true,
  getXpubDetails,
  getDerivedAddresses,
  getAverageFee,
  getUtxos,
  broadcastTransactionToBlockchain,
  getFirstUnusedAddress,
}));
