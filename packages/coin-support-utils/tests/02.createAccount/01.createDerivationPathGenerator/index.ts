import { describe, test } from '@jest/globals';
import { createDerivationPathGenerator } from '../../../src/createAccount';
import { fixtures } from './__fixtures__';

describe('01. Create Derivation Path Generator', () => {
  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, () => {
      const generator = createDerivationPathGenerator(input.basePath);
      const result = generator(input.existingDerivationPaths, input.limit);
      expect(generator).toBeInstanceOf(Function);
      expect(result).toStrictEqual(output);
    });
  });
});
