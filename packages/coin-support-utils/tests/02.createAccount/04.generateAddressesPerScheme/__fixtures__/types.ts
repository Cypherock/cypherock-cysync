import { IGenerateAddressesPerSchemeParams, generateAddressesPerScheme } from '../../../../src';

export interface AddressesPerSchemeGeneratorTestCases {
  name: string;
  input: {
    derivationPathsPerScheme: IGenerateAddressesPerSchemeParams<any>['derivationPathsPerScheme'];
  };
  output: Awaited<ReturnType<typeof generateAddressesPerScheme<any>>>;
}

export interface IFixtures {
  valid: AddressesPerSchemeGeneratorTestCases[];
}
