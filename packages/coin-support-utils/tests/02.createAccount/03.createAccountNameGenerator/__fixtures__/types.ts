import { IAccount } from '@cypherock/db-interfaces';

export interface AccountNameGeneratorTestCases {
  name: string;
  input: {
    coinName: string;
    existingAccounts: IAccount[];
    schemeNames: string[];
  };
  output: string[];
}

export interface IFixtures {
  valid: AccountNameGeneratorTestCases[];
}
