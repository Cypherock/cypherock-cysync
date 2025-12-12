import { describe, expect, test } from '@jest/globals';
import { SiaSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create Sia Coin Support', async () => {
    const support = new SiaSupport();
    expect(support).toBeDefined();
  });
});
