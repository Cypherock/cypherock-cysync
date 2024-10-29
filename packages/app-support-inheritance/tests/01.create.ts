import { describe, expect, test } from '@jest/globals';
import { InheritanceSupport } from '../src';

describe('01. Create', () => {
  test('should be able to create Inheritance Support', async () => {
    const support = new InheritanceSupport();
    expect(support).toBeDefined();
  });
});
