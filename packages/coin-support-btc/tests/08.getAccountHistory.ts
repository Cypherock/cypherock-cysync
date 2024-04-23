import { beforeEach, describe, expect, test } from '@jest/globals';

import * as testData from './__fixtures__/08.getAccountHistory';

import { BtcSupport } from '../src';

describe('08. Get Account History', () => {
  let support: BtcSupport;

  beforeEach(() => {
    support = new BtcSupport();
  });

  describe('should be able to return correct account history', () => {
    testData.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const accountHistory = await support.getAccountHistory({
          db: {} as any,
          ...testCase.params,
        });

        expect(accountHistory).toBeDefined();
        if (testCase.params.account) {
          expect(accountHistory.account).toEqual(testCase.params.account);
        }
        expect(
          accountHistory.history.slice(0, accountHistory.history.length - 1),
        ).toEqual(testCase.output.history);
      });
    });
  });
});
