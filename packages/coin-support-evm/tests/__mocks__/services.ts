import { jest } from '@jest/globals';

export const getTransactionCount = jest
  .fn()
  .mockReturnValue(Promise.resolve(0));
export const getTransactions = jest
  .fn()
  .mockReturnValue(Promise.resolve({ result: [] }));
export const getBalance = jest.fn().mockReturnValue(Promise.resolve('0'));

jest.mock('../../src/services', () => ({
  __esModule: true,
  getTransactionCount,
  getTransactions,
  getBalance,
}));
