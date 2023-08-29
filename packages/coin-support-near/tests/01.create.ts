import { describe, expect, test } from '@jest/globals';
import { NearSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create Near Coin Support', async () => {
    const support = new NearSupport();
    expect(support).toBeDefined();
  });
});
