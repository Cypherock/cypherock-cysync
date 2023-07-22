import { coinFamiliesMap } from '@cypherock/coins';
import { describe, expect, test } from '@jest/globals';

import { getCoinSupport } from '../src';

const coinFamiliesList = Object.values(coinFamiliesMap);
const unsupportedCoinFamilies = ['xrp', 'crown', 'vivo'];

describe('getCoinSupport', () => {
  describe('should return coin support for supported coin families', () => {
    coinFamiliesList.forEach(coinFamily => {
      test(`should be able to get coin support for ${coinFamily}`, async () => {
        const coinSupport = getCoinSupport(coinFamily);
        expect(coinSupport).toBeDefined();
      });
    });
  });

  describe('should throw error unsupported coin families', () => {
    unsupportedCoinFamilies.forEach(coinFamily => {
      test(`should throw error for ${coinFamily}`, async () => {
        expect(() => getCoinSupport(coinFamily)).toThrowError(
          'No coin support exists',
        );
      });
    });
  });
});
