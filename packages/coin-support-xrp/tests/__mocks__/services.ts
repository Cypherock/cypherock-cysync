import { jest } from '@jest/globals';

export const getBalance = jest.fn().mockReturnValue(Promise.resolve('0'));

export const getTransactions = jest
  .fn()
  .mockReturnValue(Promise.resolve({ transactions: [] }));

export const getAccountReserveBalance = jest
  .fn()
  .mockReturnValue(Promise.resolve('1000000'));

export const getFlagsAndSequence = jest
  .fn()
  .mockReturnValue(Promise.resolve({ flags: 0, sequence: 1 }));

export const getLastLedgerSequence = jest
  .fn()
  .mockReturnValue(Promise.resolve(1000));

jest.mock('../../src/services', () => ({
  __esModule: true,
  getBalance,
  getTransactions,
  getAccountReserveBalance,
  getFlagsAndSequence,
  getLastLedgerSequence,
}));
