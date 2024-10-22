import { describe, expect, test } from '@jest/globals';
import { XrpSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create XRP Coin Support', async () => {
    const support = new XrpSupport();
    expect(support).toBeDefined();
  });
});
