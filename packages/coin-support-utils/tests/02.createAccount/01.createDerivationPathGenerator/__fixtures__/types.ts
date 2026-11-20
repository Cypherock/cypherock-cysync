import { createDerivationPathGenerator } from '../../../../src';

export interface DerivationPathGeneratorTestCases {
  name: string;
  input: {
    basePath: string;
    existingDerivationPaths: string[];
    limit: number;
  };
  output: ReturnType<ReturnType<typeof createDerivationPathGenerator>>;
}

export interface IFixtures {
  valid: DerivationPathGeneratorTestCases[];
}
