import { TestApp } from '.';
import { IGetAddressesFromDeviceParams } from '../../src';
import { getAddressFromPath } from '../__fixtures__/derivationPathAddressMap';

export const getAddressesFromDeviceImplementation = async ({
  derivationPaths,
}: IGetAddressesFromDeviceParams<TestApp>): Promise<string[]> =>
  derivationPaths.map(
    ({ derivationPath }) => getAddressFromPath(derivationPath)!,
  );

export const getAddressesFromDeviceMock = jest.fn(
  getAddressesFromDeviceImplementation,
);
