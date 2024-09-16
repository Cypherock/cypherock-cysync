import { jest } from '@jest/globals';
import { IMakeCreateAccountsObservableParams } from '../../src';
import { TestApp, testApp } from '.';

export const createAppMock = jest
  .fn<IMakeCreateAccountsObservableParams<TestApp>['createApp']>()
  .mockResolvedValue(testApp);
