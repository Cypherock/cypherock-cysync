import { describe, expect, test } from '@jest/globals';

import { formatDateToUTCString } from '../../src';
import { fixtures } from './__fixtures__';

describe('formatDateToUTCString', () => {
  test('should export formatDateToUTCString', async () => {
    expect(formatDateToUTCString).toBeDefined();
  });

  fixtures.valid.forEach(({ input, output }) => {
    test(`Should return "${output}" for input "${input}"`, async () => {
      const result = formatDateToUTCString(input);
      expect(result).toBe(output);
    });
  });
});
