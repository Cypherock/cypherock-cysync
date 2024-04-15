import {
  IMakeCreateAccountsObservableParams,
  createDerivationPathGenerator,
} from '../../src/createAccount';
import { TestApp } from './app';
import { db, getAddressesFromDeviceMock } from '.';
import { createAppMock } from './createApp';
import { getBalanceAndTxnCountMock } from './getBalanceAndTxnCount';

export const createAccountParams =
  (): IMakeCreateAccountsObservableParams<TestApp> => ({
    createApp: createAppMock,
    derivationPathSchemes: {
      legacy: {
        name: 'legacy',
        generator: createDerivationPathGenerator("m/44'/0'/0'/0/i"),
        threshold: 2,
        newAccountLimit: 0,
      },
      segwit: {
        name: 'segwit',
        generator: createDerivationPathGenerator(`m/49'/0'/0'/0/i`),
        threshold: 2,
        newAccountLimit: 0,
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
    waitInMSBetweenEachAccountAPI: 1,
  });
