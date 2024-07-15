import { describe, expect, test } from '@jest/globals';

import * as coingeckoMocks from '../src/__mocks__/coingecko';

import { getTokenDifference } from '../src';
import testCases from './__fixtures__/01.tokenDiff';

describe('getTokenDifference', () => {
  beforeAll(() => {
    coingeckoMocks.getCoingeckoCoinList.mockReturnValueOnce(
      Promise.resolve([]),
    );
    coingeckoMocks.getCoingeckoCoinDetails.mockReturnValueOnce(
      Promise.resolve({} as any),
    );
  });

  describe('validation', () => {
    describe('should throw error with invalid params', () => {
      testCases.invalid.forEach(testCase => {
        test(testCase.name, async () => {
          await expect(getTokenDifference(testCase.params)).rejects.toThrow(
            'AssertionError',
          );
        });
      });
    });
  });
});
