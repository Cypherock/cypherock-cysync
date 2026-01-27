import { describe, expect, test } from '@jest/globals';
import { CantonSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create Canton Coin Support', async () => {
    const support = new CantonSupport();
    expect(support).toBeDefined();
  });
});
