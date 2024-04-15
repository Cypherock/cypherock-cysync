import { describe, test } from '@jest/globals';

import { fixtures } from './__fixtures__';
import { TestApp, getAddressesFromDeviceMock } from '../../__mocks__';
import {
  IGenerateAddressesPerSchemeParams,
  generateAddressesPerScheme,
} from '../../../src';

describe('04. Generate Addresses Per Scheme', () => {
  fixtures.valid.forEach(({ name, input, output }) => {
    test(name, async () => {
      const params: IGenerateAddressesPerSchemeParams<TestApp> = {
        derivationPathsPerScheme: input.derivationPathsPerScheme,
        getAddressesFromDevice: getAddressesFromDeviceMock,
      } as any;
      const result = await generateAddressesPerScheme(params);
      expect(result).toStrictEqual(output);
    });
  });
});
