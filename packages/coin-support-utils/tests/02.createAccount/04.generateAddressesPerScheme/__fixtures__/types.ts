import { generateAddressesPerScheme } from '../../../../src';

export interface AddressesPerSchemeGeneratorTestCases {
  name: string;
  input: {
    derivationPathsPerScheme: Record<
      string,
      {
        derivationPath: string;
        index: number;
      }[]
    >;
  };
  output: Awaited<ReturnType<typeof generateAddressesPerScheme>>;
}

export interface IFixtures {
  valid: AddressesPerSchemeGeneratorTestCases[];
}
