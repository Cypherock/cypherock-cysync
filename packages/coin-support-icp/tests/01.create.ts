import { describe, expect, test } from '@jest/globals';
import { IcpSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create XRP Coin Support', async () => {
    const support = new IcpSupport();
    expect(support).toBeDefined();
  });
});
