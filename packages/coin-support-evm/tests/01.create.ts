import { describe, expect, test } from '@jest/globals';
import { EvmSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create EVM Coin Support', async () => {
    const support = new EvmSupport();
    expect(support).toBeDefined();
  });
});
