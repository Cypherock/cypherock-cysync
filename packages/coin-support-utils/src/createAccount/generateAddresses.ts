import {
  ICreateAccountEvent,
  ICreateAccountParams,
  IX0Session,
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

export interface IGetAddressesFromX0Params extends ICreateAccountParams {
  derivationPaths: { derivationPath: number[]; index: number }[];
  observer: Subscriber<ICreateAccountEvent>;
  x0: IX0Session;
}

export type GetAddressesFromX0 = (
  params: IGetAddressesFromX0Params,
) => Promise<string[]>;

interface IGenerateAddressesBaseParams extends ICreateAccountParams {
  derivationPathsPerScheme: Record<
    string,
    { derivationPath: string; index: number }[]
  >;
  observer: Subscriber<ICreateAccountEvent>;
}

export interface IGenerateAddressesPerSchemeParams<T>
  extends IGenerateAddressesBaseParams {
  getAddressesFromDevice: GetAddressesFromDevice<T>;
  app: T;
}

export interface IGenerateAddressesPerSchemeX0Params
  extends IGenerateAddressesBaseParams {
  getAddressesFromX0: GetAddressesFromX0;
  x0: IX0Session;
}

async function generateAddressesPerSchemeWith(
  params: IGenerateAddressesBaseParams,
  getAddresses: (
    derivationPaths: { derivationPath: number[]; index: number }[],
  ) => Promise<string[]>,
) {
  const { derivationPathsPerScheme } = params;
  const allDerivationPaths = Object.values(derivationPathsPerScheme).reduce(
    (a, b) => [...a, ...b],
    [],
  );
  const mappedDerivationPaths = allDerivationPaths.map(d => ({
    derivationPath: mapDerivationPath(d.derivationPath),
    index: d.index,
  }));

  const addresses = await getAddresses(mappedDerivationPaths);

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

export async function generateAddressesPerScheme<T>(
  params: IGenerateAddressesPerSchemeParams<T>,
) {
  return generateAddressesPerSchemeWith(params, derivationPaths =>
    params.getAddressesFromDevice({ ...params, derivationPaths }),
  );
}

export async function generateAddressesPerSchemeX0(
  params: IGenerateAddressesPerSchemeX0Params,
) {
  return generateAddressesPerSchemeWith(params, derivationPaths =>
    params.getAddressesFromX0({ ...params, derivationPaths }),
  );
}
