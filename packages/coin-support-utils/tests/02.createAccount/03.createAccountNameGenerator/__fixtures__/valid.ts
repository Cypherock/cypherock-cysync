import { accounts } from '../../../__fixtures__';
import { AccountNameGeneratorTestCases } from './types';

export const valid: AccountNameGeneratorTestCases[] = [
  {
    name: 'should generate derivation paths from index zero for same scheme',
    input: {
      coinName: 'Bitcoin',
      schemeNames: ['legacy', 'legacy'],
      existingAccounts: [],
    },
    output: ['Bitcoin 1', 'Bitcoin 2'],
  },
  {
    name: 'should generate derivation paths from index zero for different schemes',
    input: {
      coinName: 'Bitcoin',
      schemeNames: ['legacy', 'taproot', 'nativeSegwit', 'nativeSegwit'],
      existingAccounts: [],
    },
    output: ['Bitcoin 1', 'Bitcoin 1', 'Bitcoin 1', 'Bitcoin 2'],
  },
  {
    name: 'should generate derivation paths filtering existing accounts for different schemes',
    input: {
      coinName: 'Bitcoin',
      schemeNames: ['legacy', 'something random'],
      existingAccounts: accounts,
    },
    output: ['Bitcoin 2', 'Bitcoin 1'],
  },
];
