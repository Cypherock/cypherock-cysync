import { IAccount } from '@cypherock/db-interfaces';

export interface AccountNameGeneratorTestCases {
  name: string;
  input: {
    coinName: string;
    schemeName: string;
    existingAccounts: IAccount[];
  };
  output: string;
}

export interface IFixtures {
  valid: AccountNameGeneratorTestCases[];
}
