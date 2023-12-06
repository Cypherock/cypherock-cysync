import { describe, expect, test } from '@jest/globals';
import { SolanaSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create Solana Coin Support', async () => {
    const support = new SolanaSupport();
    expect(support).toBeDefined();
  });
});
