import { describe, test } from '@jest/globals';
import { createAccountNameGenerator } from '../../../src';
import { fixtures } from './__fixtures__';

describe('createAccountNameGenerator', () => {
  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, () => {
      const generator = createAccountNameGenerator(input.coinName);
      const result = generator(input.schemeName, input.existingAccounts);
      expect(result).toBe(output);
    });
  });
});
