import {
  IGenerateDerivationPathsPerSchemeParams,
  generateDerivationPathsPerScheme,
} from '../../../../src';

export interface DerivationPathPerSchemeGeneratorTestCases {
  name: string;
  input: IGenerateDerivationPathsPerSchemeParams;
  output: ReturnType<typeof generateDerivationPathsPerScheme>;
}

export interface IFixtures {
  valid: DerivationPathPerSchemeGeneratorTestCases[];
}
