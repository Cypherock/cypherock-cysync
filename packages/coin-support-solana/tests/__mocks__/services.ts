import { jest } from '@jest/globals';

export const getTransactions = jest
  .fn()
  .mockReturnValue(Promise.resolve({ data: [] }));
export const getBalance = jest.fn().mockReturnValue(Promise.resolve('0'));
export const doesAccountExist = jest
  .fn()
  .mockReturnValue(Promise.resolve(true));
export const getFees = jest.fn().mockReturnValue(Promise.resolve('5000'));
export const getRentExemptFees = jest
  .fn()
  .mockReturnValue(Promise.resolve('890880'));
export const getNativeAccountRentExemptFees = jest
  .fn()
  .mockReturnValue(Promise.resolve('890880'));
export const getTokenAccountRentExemptFees = jest
  .fn()
  .mockReturnValue(Promise.resolve('2039280'));
export const getPriorityFees = jest.fn().mockReturnValue(Promise.resolve(100));
export const getSimulationComputeUnits = jest
  .fn()
  .mockReturnValue(Promise.resolve(150));
export const broadcastTransactionToBlockchain = jest
  .fn()
  .mockReturnValue(Promise.resolve('test'));
export const checkTransactionStatus = jest
  .fn()
  .mockReturnValue(Promise.resolve('confirmed'));

jest.mock('../../src/services', () => ({
  __esModule: true,
  getTransactions,
  getBalance,
  doesAccountExist,
  getFees,
  getPriorityFees,
  getSimulationComputeUnits,
  broadcastTransactionToBlockchain,
  checkTransactionStatus,
  getRentExemptFees,
  getNativeAccountRentExemptFees,
  getTokenAccountRentExemptFees,
}));
