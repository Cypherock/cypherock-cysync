import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import * as testData from './__fixtures__/04.initializeTransaction';
import * as serviceMock from './__mocks__/services';

import { BtcSupport } from '../src';

describe('04. Create Transaction', () => {
  let support: BtcSupport;

  beforeEach(() => {
    support = new BtcSupport();

    serviceMock.getAverageFee.mockClear();
  });

  describe('should be able to create transaction', () => {
    testData.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const getOneMock = jest.fn().mockReturnValue(testCase.mocks.account);
        const db = {
          account: {
            getOne: getOneMock,
          },
        } as any;
        serviceMock.getAverageFee.mockReturnValue(
          Promise.resolve(testCase.mocks.averageFee),
        );
        serviceMock.getUtxos.mockReturnValue(
          Promise.resolve(testCase.mocks.utxos),
        );

        const result = await support.initializeTransaction({
          db,
          accountId: testCase.txn.accountId,
        });

        expect(result).toBeDefined();
        expect(result).toEqual(testCase.txn);
      });
    });
  });
});
