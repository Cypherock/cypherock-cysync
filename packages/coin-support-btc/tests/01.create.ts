import { describe, expect, test } from '@jest/globals';
import { BtcSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create BTC Coin Support', async () => {
    const support = new BtcSupport();
    expect(support).toBeDefined();
  });
});
