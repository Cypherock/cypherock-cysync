import { jest } from '@jest/globals';

export const getXpubDetails = jest
  .fn()
  .mockReturnValue(Promise.resolve({ balance: '0', txs: 0 }));

jest.mock('../../src/services', () => ({
  __esModule: true,
  getXpubDetails,
}));
