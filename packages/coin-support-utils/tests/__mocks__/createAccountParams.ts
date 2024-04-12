import { IDatabase } from '@cypherock/db-interfaces';
import { IMakeCreateAccountsObservableParams } from '../../src/createAccount';
import { TestApp, testApp } from './app';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createAccountParams = (
  db: IDatabase,
  connection: IDeviceConnection,
): IMakeCreateAccountsObservableParams<TestApp> => ({
  createApp: jest.fn().mockResolvedValue(testApp),
  derivationPathSchemes: {
    legacy: {
      threshold: 2,
      newAccountLimit: 3,
      name: 'ac1',
      generator: jest.fn(),
    },
  },
  derivationPathLimit: 10,
  getBalanceAndTxnCount: jest
    .fn()
    .mockResolvedValue({ balance: '0', txnCount: 0 }),
  getAddressesFromDevice: jest.fn(),
  createAccountFromAddress: jest.fn().mockResolvedValue({}),
  coinId: 'testCoin',
  walletId: 'testWallet',
  db,
  connection,
});
