import { jest } from '@jest/globals';

export const getTransactionCount = jest
  .fn()
  .mockReturnValue(Promise.resolve(0));

export const getBalance = jest
  .fn()
  .mockReturnValue(Promise.resolve({ balance: '0' }));

jest.mock('../../src/services', () => ({
  __esModule: true,
  getTransactionCount,
  getBalance,
}));
