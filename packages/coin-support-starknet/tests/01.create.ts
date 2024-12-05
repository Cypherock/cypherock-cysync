import { describe, expect, test } from '@jest/globals';
import { StarknetSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create STARKNET Coin Support', async () => {
    const support = new StarknetSupport();
    expect(support).toBeDefined();
  });
});
