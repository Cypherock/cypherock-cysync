import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import * as solanaWeb3 from '@solana/web3.js';
import * as splTokenLib from '@solana/spl-token';

import * as testData from './__fixtures__/05.prepareTransaction';
import * as serviceMock from './__mocks__/services';

import { SolanaSupport } from '../src';

describe('05. Prepare Transaction', () => {
  let support: SolanaSupport;

  beforeEach(() => {
    SolanaSupport.setWeb3Library(solanaWeb3);
    SolanaSupport.setSplTokenLibrary(splTokenLib);
    support = new SolanaSupport();

    serviceMock.getFees.mockClear();
  });

  describe('should be able to prepare transaction', () => {
    testData.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const getOneMock = jest.fn().mockReturnValue(testCase.mocks.account);
        const db = {
          account: {
            getOne: getOneMock,
          },
        } as any;

        const result = await support.prepareTransaction({
          db,
          accountId: testCase.txn.accountId,
          txn: testCase.txn,
        });

        expect(result).toBeDefined();
        expect(result).toEqual(testCase.output);
      });
    });
  });
});
