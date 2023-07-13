import { BtcApp } from '@cypherock/sdk-app-btc';
import { jest } from '@jest/globals';

const DUMMY_XPUBS = [
  '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',
];

export const getXpubs = jest
  .fn<BtcApp['getXpubs']>()
  .mockReturnValue(Promise.resolve({ xpubs: DUMMY_XPUBS }));

export const create = jest.fn(async () =>
  Promise.resolve({
    getXpubs,
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
