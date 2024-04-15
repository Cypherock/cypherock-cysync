export interface DerivationPathGeneratorTestCases {
  name: string;
  input: {
    basePath: string;
    existingDerivationPaths: string[];
    limit: number;
  };
  output: {
    derivationPath: string;
    index: number;
  }[];
}

export interface IFixtures {
  valid: DerivationPathGeneratorTestCases[];
}
