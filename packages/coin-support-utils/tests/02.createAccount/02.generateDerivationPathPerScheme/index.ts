import { describe, test } from '@jest/globals';
import { fixtures } from './__fixtures__';
import { generateDerivationPathsPerScheme } from '../../../src';

describe('02. generateDerivationPathsPerScheme', () => {
  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, () => {
      const result = generateDerivationPathsPerScheme(input);
      expect(result).toStrictEqual(output);
    });
  });
});
