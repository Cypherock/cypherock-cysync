import { jest } from '@jest/globals';

export const getTransactions = jest
  .fn()
  .mockReturnValue(Promise.resolve({ data: [] }));
export const getBalance = jest.fn().mockReturnValue(Promise.resolve('0'));
export const getFees = jest.fn().mockReturnValue(Promise.resolve('5000'));
export const broadcastTransactionToBlockchain = jest
  .fn()
  .mockReturnValue(Promise.resolve('test'));

jest.mock('../../src/services', () => ({
  __esModule: true,
  getTransactions,
  getBalance,
  getFees,
  broadcastTransactionToBlockchain,
}));
