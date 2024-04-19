import { IDatabase } from '@cypherock/db-interfaces';
import { getAddressesFromDeviceMock } from '.';
import {
  IMakeCreateAccountsObservableParams,
  createDerivationPathGenerator,
} from '../../src/createAccount';
import { TestApp } from './app';
import { createAppMock } from './createApp';
import { getBalanceAndTxnCountMock } from './getBalanceAndTxnCount';

export const createAccountParams = (
  db: IDatabase,
  waitInMSBetweenEachAccountAPI?: number,
): IMakeCreateAccountsObservableParams<TestApp> => ({
  createApp: createAppMock,
  derivationPathSchemes: {
    legacy: {
      name: 'legacy',
      generator: createDerivationPathGenerator("m/44'/0'/0'/0/i"),
      threshold: 2,
      newAccountLimit: 2,
    },
    nativeSegwit: undefined,
    segwit: {
      name: 'segwit',
      generator: createDerivationPathGenerator(`m/49'/0'/0'/0/i`),
      threshold: 2,
      newAccountLimit: 2,
    },
  },
  derivationPathLimit: 2,
  getBalanceAndTxnCount: getBalanceAndTxnCountMock,
  getAddressesFromDevice: getAddressesFromDeviceMock,
  createAccountFromAddress: jest.fn().mockResolvedValue({}),
  coinId: 'testCoin',
  walletId: 'testWallet',
  db,
  connection: {} as any,
  waitInMSBetweenEachAccountAPI,
});
