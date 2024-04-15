import { IGetAddressesFromDeviceParams } from '../../../../src';
import { TestApp } from '../../../__mocks__';
import { derivationPathAddressMap } from '../__fixtures__/derivationPathAddressMap';

export const getAddressesFromDeviceMock = jest.fn(
  async ({
    derivationPaths,
  }: IGetAddressesFromDeviceParams<TestApp>): Promise<string[]> =>
    derivationPaths.map(
      ({ derivationPath }) => derivationPathAddressMap.get(derivationPath)!,
    ),
);
