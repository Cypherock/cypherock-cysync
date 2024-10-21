import { jest } from '@jest/globals';
import { IMakeCreateAccountsObservableParams } from '../../src';
import { TestApp } from '.';

export const getBalanceAndTxnCountMock = jest
  .fn<IMakeCreateAccountsObservableParams<TestApp>['getBalanceAndTxnCount']>()
  .mockResolvedValue({ balance: '0', txnCount: 0 });
