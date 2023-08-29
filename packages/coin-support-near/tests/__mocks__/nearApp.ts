import { NearApp } from '@cypherock/sdk-app-near';
import { jest } from '@jest/globals';

const DUMMY_ADDRESSES = [
  '03ac41f86e4b44155d81a339422480e1d2b6eee723c531a41599e4ea775dc449fa',
  '0397e466b59adde8d4249f3b87c9bc17b9fb1b7bd4707bb2261f15b30e7bcd7f24',
  '02e5bb7abea03f46ce6f0995ad9ebbb6d14d079783970a93d91c0915a51c7e7d8c',
  '0312e89300c02da84264a33f35386827d9ccb219917d64f9f1b8a175b570ac86f7',
];

export const getPublicKeys = jest
  .fn<NearApp['getPublicKeys']>()
  .mockReturnValue(Promise.resolve({ publicKeys: DUMMY_ADDRESSES }));

export const getUserVerifiedPublicKey = jest
  .fn<NearApp['getUserVerifiedPublicKey']>()
  .mockReturnValue(Promise.resolve({ publicKey: DUMMY_ADDRESSES[0] }));

export const abort = jest
  .fn<NearApp['abort']>()
  .mockReturnValue(Promise.resolve());

export const destroy = jest
  .fn<NearApp['destroy']>()
  .mockReturnValue(Promise.resolve());

export const create = jest.fn(async () =>
  Promise.resolve({
    getUserVerifiedPublicKey,
    getPublicKeys,
    abort,
    destroy,
  }),
);

jest.mock('@cypherock/sdk-app-near', () => {
  const originalModule: any = jest.requireActual('@cypherock/sdk-app-near');

  return {
    __esModule: true,
    ...originalModule,
    NearApp: {
      create,
    },
  };
});
