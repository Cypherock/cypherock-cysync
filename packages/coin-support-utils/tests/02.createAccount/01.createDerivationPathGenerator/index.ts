import { describe, test } from '@jest/globals';
import { createDerivationPathGenerator } from '../../../src/createAccount';
import { fixtures } from './__fixtures__';

describe('01. Create Derivation Path Generator', () => {
  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, () => {
      const generator = createDerivationPathGenerator(input.basePath);
      expect(generator).toBeInstanceOf(Function);
      const result = generator(input.existingDerivationPaths, input.limit);
      expect(result).toStrictEqual(output);
    });
  });
});
