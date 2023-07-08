import {
  ICreateAccountEvent,
  ICreateAccountParams,
} from '@cypherock/coin-support-interfaces';
import { Subscriber } from 'rxjs';

export const mapDerivationPath = (derivationPath: string) => {
  const paths: number[] = [];

  const pathArr = derivationPath.split('/');

  for (const path of pathArr) {
    if (path !== 'm') {
      const isHardened = path.includes("'");
      let index = parseInt(path.replace("'", ''), 10);

      if (isHardened) {
        index += 0x80000000;
      }

      paths.push(index);
    }
  }

  return paths;
};

export interface IGetAddressesFromDeviceParams<T> extends ICreateAccountParams {
  derivationPaths: number[][];
  observer: Subscriber<ICreateAccountEvent>;
  app: T;
}

export type GetAddressesFromDevice<T> = (
  params: IGetAddressesFromDeviceParams<T>,
) => Promise<string[]>;

export interface IGenerateAddressesPerSchemeParams<T>
  extends ICreateAccountParams {
  derivationPathsPerScheme: Record<string, string[]>;
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
  const mappedDerivationPaths = allDerivationPaths.map(mapDerivationPath);

  const addresses = await params.getAddressesFromDevice({
    ...params,
    derivationPaths: mappedDerivationPaths,
  });

  const addressesPerScheme: Record<
    string,
    { address: string; derivationPath: string }[]
  > = {};

  let index = 0;
  const mapAddresses = (path: string, i: number) => ({
    address: addresses[index + i].toLowerCase(),
    derivationPath: path,
  });

  for (const schemeName of Object.keys(derivationPathsPerScheme)) {
    const paths = derivationPathsPerScheme[schemeName];
    addressesPerScheme[schemeName] = paths.map(mapAddresses);
    index += paths.length;
  }

  return addressesPerScheme;
}
