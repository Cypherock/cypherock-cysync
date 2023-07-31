import {
  ICreateAccountEvent,
  ICreateAccountParams,
} from '@cypherock/coin-support-interfaces';
import { Subscriber } from 'rxjs';

import { mapDerivationPath } from '../common';

export interface IGetAddressesFromDeviceParams<T> extends ICreateAccountParams {
  derivationPaths: { derivationPath: number[]; index: number }[];
  observer: Subscriber<ICreateAccountEvent>;
  app: T;
}

export type GetAddressesFromDevice<T> = (
  params: IGetAddressesFromDeviceParams<T>,
) => Promise<string[]>;

export interface IGenerateAddressesPerSchemeParams<T>
  extends ICreateAccountParams {
  derivationPathsPerScheme: Record<
    string,
    { derivationPath: string; index: number }[]
  >;
  observer: Subscriber<ICreateAccountEvent>;
  getAddressesFromDevice: GetAddressesFromDevice<T>;
  app: T;
}

export async function generateAddressesPerScheme<T>(
  params: IGenerateAddressesPerSchemeParams<T>,
) {
  const { derivationPathsPerScheme } = params;
  const allDerivationPaths = Object.values(derivationPathsPerScheme).reduce(
    (a, b) => [...a, ...b],
    [],
  );
  const mappedDerivationPaths = allDerivationPaths.map(d => ({
    derivationPath: mapDerivationPath(d.derivationPath),
    index: startIndex,
  }));

  const addresses = await params.getAddressesFromDevice({
    ...params,
    derivationPaths: mappedDerivationPaths,
  });

  const addressesPerScheme: Record<
    string,
    { address: string; derivationPath: string; index: number }[]
  > = {};

  let startIndex = 0;

  const mapAddresses = (
    { derivationPath, index }: { derivationPath: string; index: number },
    i: number,
  ) => ({
    address: addresses[startIndex + i],
    derivationPath,
    index,
  });

  for (const schemeName of Object.keys(derivationPathsPerScheme)) {
    const paths = derivationPathsPerScheme[schemeName];
    addressesPerScheme[schemeName] = paths.map(mapAddresses);
    startIndex += paths.length;
  }

  return addressesPerScheme;
}
