import { describe, expect, test } from '@jest/globals';

import { createCSVFromObject } from '../../src';
import { fixtures } from './__fixtures__';

describe('createCSVFromObject', () => {
  test('should export createCSVFromObject', async () => {
    expect(createCSVFromObject).toBeDefined();
  });

  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, async () => {
      const result = createCSVFromObject(input);
      expect(result).toBe(output);
    });
  });
});
