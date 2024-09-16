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
  output: Record<
    string,
    {
      address: string;
      derivationPath: string;
      index: number;
    }[]
  >;
}

export interface IFixtures {
  valid: AddressesPerSchemeGeneratorTestCases[];
}
