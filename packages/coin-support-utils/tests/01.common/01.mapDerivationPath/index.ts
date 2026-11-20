import { describe, test } from '@jest/globals';
import { fixtures } from './__fixtures__';
import { mapDerivationPath } from '../../../src';

describe('mapDerivationPath', () => {
  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, () => {
      const result = mapDerivationPath(input);
      expect(result).toStrictEqual(output);
    });
  });
});
