import { IGenerateDerivationPathsPerSchemeParams } from '../../../../src/createAccount';

export interface DerivationPathPerSchemeGeneratorTestCases {
  name: string;
  input: IGenerateDerivationPathsPerSchemeParams;
  output: Record<
    string,
    {
      derivationPath: string;
      index: number;
    }[]
  >;
}

export interface IFixtures {
  valid: DerivationPathPerSchemeGeneratorTestCases[];
}
