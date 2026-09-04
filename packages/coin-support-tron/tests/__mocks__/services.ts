import { jest } from '@jest/globals';

export const getBalanceAndTransactionsCount = jest
  .fn()
  .mockReturnValue(Promise.resolve({ balance: '0', txnCount: 0 }));

jest.mock('../../src/services', () => ({
  __esModule: true,
  getBalanceAndTransactionsCount,
}));
