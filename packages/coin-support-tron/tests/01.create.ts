import { describe, expect, test } from '@jest/globals';
import { TronSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create Tron Coin Support', async () => {
    const support = new TronSupport();
    expect(support).toBeDefined();
  });
});
