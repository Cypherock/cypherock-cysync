import { SolanaApp } from '@cypherock/sdk-app-solana';
import { jest } from '@jest/globals';

const DUMMY_ADDRESSES = [
  'wRKLUHF4oyRLnFn1zaPwSZK9VDwb4ksY3hP4rToz51pq',
  'nXbU3ymwStqtHwcpZjKCLenRVc8S4tFErS4U1AU81Kao',
  '286PFukQ4dymaVFf7unV3XLHY5ZNLXwfhPvCy4pGHY7ou',
  'gPYzvXqqJAF7nGYfe9fyJeE6QFUQ2cA43bTDw3BMc2xr',
];

export const getPublicKeys = jest
  .fn<SolanaApp['getPublicKeys']>()
  .mockReturnValue(Promise.resolve({ publicKeys: DUMMY_ADDRESSES }));

export const getUserVerifiedPublicKey = jest
  .fn<SolanaApp['getUserVerifiedPublicKey']>()
  .mockReturnValue(Promise.resolve({ publicKey: DUMMY_ADDRESSES[0] }));

export const signTxn = jest.fn<SolanaApp['signTxn']>().mockReturnValue(
  Promise.resolve({
    signature: 'signature',
    serializedTxn: 'base58txn',
    serializedTxnHex: 'hextxn',
  }),
);

export const getLatestBlockHash = jest
  .fn()
  .mockReturnValue(Promise.resolve('hash'));

export const abort = jest
  .fn<SolanaApp['abort']>()
  .mockReturnValue(Promise.resolve());

export const destroy = jest
  .fn<SolanaApp['destroy']>()
  .mockReturnValue(Promise.resolve());

export const create = jest.fn(async () =>
  Promise.resolve({
    getUserVerifiedPublicKey,
    getPublicKeys,
    abort,
    destroy,
    signTxn,
  }),
);

jest.mock('@cypherock/sdk-app-solana', () => {
  const originalModule: any = jest.requireActual('@cypherock/sdk-app-solana');

  return {
    __esModule: true,
    ...originalModule,
    SolanaApp: {
      create,
    },
    getLatestBlockHash,
  };
});
