import { describe, test } from '@jest/globals';
import { createAccountNameGenerator } from '../../../src';
import { fixtures } from './__fixtures__';

describe('03. createAccountNameGenerator', () => {
  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, () => {
      const generator = createAccountNameGenerator(input.coinName);
      expect(generator).toBeInstanceOf(Function);
      input.schemeNames.forEach((schemeName, i) => {
        const result = generator(schemeName, input.existingAccounts);
        expect(result).toBe(output[i]);
      });
    });
  });
});
