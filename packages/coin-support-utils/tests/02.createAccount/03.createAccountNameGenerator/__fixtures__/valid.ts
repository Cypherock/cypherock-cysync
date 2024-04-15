import { accounts } from '../../../__fixtures__';
import { AccountNameGeneratorTestCases } from './types';

export const valid: AccountNameGeneratorTestCases[] = [
  {
    name: 'should generate derivation paths from index zero',
    input: {
      coinName: 'Bitcoin',
      schemeName: 'legacy',
      existingAccounts: [],
    },
    output: 'Bitcoin 1',
  },
  {
    name: 'should generate derivation paths from index zero',
    input: {
      coinName: 'Bitcoin',
      schemeName: 'legacy',
      existingAccounts: accounts,
    },
    output: 'Bitcoin 2',
  },
  {
    name: 'should generate derivation paths from index zero',
    input: {
      coinName: 'Bitcoin',
      schemeName: 'something random',
      existingAccounts: accounts,
    },
    output: 'Bitcoin 1',
  },
];
