import { describe, expect, test } from '@jest/globals';
import { StellarSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create Stellar Coin Support', async () => {
    const support = new StellarSupport();
    expect(support).toBeDefined();
  });
});
