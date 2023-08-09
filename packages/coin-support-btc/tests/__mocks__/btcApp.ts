import { BtcApp } from '@cypherock/sdk-app-btc';
import { jest } from '@jest/globals';

const DUMMY_XPUBS = [
  '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',
];

export const getXpubs = jest
  .fn<BtcApp['getXpubs']>()
  .mockReturnValue(Promise.resolve({ xpubs: DUMMY_XPUBS }));

export const abort = jest
  .fn<BtcApp['abort']>()
  .mockReturnValue(Promise.resolve());

export const destroy = jest
  .fn<BtcApp['destroy']>()
  .mockReturnValue(Promise.resolve());

export const getPublicKey = jest.fn<BtcApp['getPublicKey']>().mockReturnValue(
  Promise.resolve({
    publicKey: new Uint8Array([1, 2, 3]),
    address: 'mg3vuEjS6tu8tUys6LL2fuSG3gbXyx2Z3b',
  }),
);

export const signTxn = jest.fn<BtcApp['signTxn']>().mockReturnValue(
  Promise.resolve({
    signatures: ['test'],
    signedTransaction: 'aksjhdkadh',
  }),
);

export const create = jest.fn(async () =>
  Promise.resolve({
    getXpubs,
    getPublicKey,
    signTxn,
    abort,
    destroy,
  }),
);

jest.mock('@cypherock/sdk-app-btc', () => {
  const originalModule: any = jest.requireActual('@cypherock/sdk-app-btc');

  return {
    __esModule: true,
    ...originalModule,
    BtcApp: {
      create,
    },
  };
});
