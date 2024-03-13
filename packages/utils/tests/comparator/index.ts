import { describe, expect, test } from '@jest/globals';

import { createComparator } from '../../src';
import { fixtures } from './__fixtures__';

describe('createComparator', () => {
  test('should export createComparator function', async () => {
    expect(createComparator).toBeDefined();
  });

  test('should return a function', async () => {
    const compare = createComparator('key', 'string');
    expect(compare).toBeInstanceOf(Function);
  });

  describe('compare valid string and number', () => {
    fixtures.valid.forEach(({ name, input, output }) => {
      test(name, async () => {
        const compare = createComparator(input.key, input.keyType);
        expect(compare(input.first, input.second)).toBe(output);
      });
    });
  });

  describe('throw error when invalid params', () => {
    fixtures.invalid.forEach(({ name, input, errorMessage }) => {
      test(name, async () => {
        const compare = createComparator(input.key, input.keyType);
        expect(() => compare(input.first, input.second)).toThrow(errorMessage);
      });
    });
  });
});
