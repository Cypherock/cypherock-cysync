import { describe, test } from '@jest/globals';
import { fixtures } from './__fixtures__';
import { mapDerivationPath } from '../../../src';

describe('01. mapDerivationPath', () => {
  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, () => {
      const result = mapDerivationPath(input);
      expect(result).toStrictEqual(output);
    });
  });
});
