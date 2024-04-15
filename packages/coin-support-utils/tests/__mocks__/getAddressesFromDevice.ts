import { IGetAddressesFromDeviceParams } from '../../src';
import { TestApp } from '.';
import { getAddressFromPath } from '../__fixtures__/derivationPathAddressMap';

export const getAddressesFromDeviceMock = jest.fn(
  async ({
    derivationPaths,
  }: IGetAddressesFromDeviceParams<TestApp>): Promise<string[]> =>
    derivationPaths.map(
      ({ derivationPath }) => getAddressFromPath(derivationPath)!,
    ),
);
