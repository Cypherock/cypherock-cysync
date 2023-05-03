/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { EvmApp, IGetPublicKeysDerivationPath } from '@cypherock/sdk-app-evm';
import { evmCoinList } from '@cypherock/coins';

import { derivationPathSchemes } from './schemes';
import { DerivationSchemeName } from './schemes/types';
import { ICreateAccountParams } from './types';

const DERIVATION_PATH_LIMIT = 50;

export const createAccounts = async (params: ICreateAccountParams) => {
  const { connection, walletId, coinId } = params;

  const derivationPaths = await generateDerivationPaths(params);
  // console.log(derivationPaths);

  const addresses = await generateAddresses(
    connection,
    walletId,
    derivationPaths,
    coinId,
  );
  // console.log(addresses);
  return Object.values(addresses).flat();
};

// TODO: move this to SDK
const mapDerivationPath = (derivationPath: string) => {
  const paths: IGetPublicKeysDerivationPath = { path: [] };
  const pathArr = derivationPath.split('/');

  for (const path of pathArr) {
    if (path !== 'm') {
      const isHardened = path.includes("'");
      paths.path.push({
        isHardened,
        index: parseInt(path.replace("'", ''), 10),
      });
    }
  }

  return paths;
};

async function generateAddresses(
  connection: ICreateAccountParams['connection'],
  walletId: string,
  derivationPaths: Record<string, string[]>,
  coinId: string,
) {
  const allDerivationPaths = Object.values(derivationPaths).reduce(
    (a, b) => [...a, ...b],
    [],
  );
  // const mappedDerivationPaths = allDerivationPaths.map(mapDerivationPath);

  const publicKeys = allDerivationPaths;
  // TODO: Uncomment when SDK is working with the device
  // const app = await EvmApp.create(connection);
  // const { publicKeys } = await app.getPublicKeys({
  //   walletId: hexToUint8Array(walletId),
  //   derivationPaths: mappedDerivationPaths,
  //   chainId: evmCoinList[coinId].chain,
  // });
  const publicKeysPerScheme: Record<string, string[]> = {};

  let index = 0;
  for (const schemeName of Object.keys(derivationPaths)) {
    const paths = derivationPaths[schemeName];
    publicKeysPerScheme[schemeName] = publicKeys.slice(
      index,
      index + paths.length,
    );
    index += paths.length;
  }

  return publicKeysPerScheme;
}

async function generateDerivationPaths(params: ICreateAccountParams) {
  const { db, walletId } = params;

  const accounts = await db.account.getAll({ walletId });
  const existingDerivationPaths = accounts.map(e => e.derivationPath);

  const derivationSchemeNames = Object.keys(
    derivationPathSchemes,
  ) as DerivationSchemeName[];
  const pathLimitPerDerivationScheme = Math.floor(
    DERIVATION_PATH_LIMIT / derivationSchemeNames.length,
  );

  const derivedPathsPerScheme: Record<string, string[]> = {};
  const derivedPaths: string[] = [];

  for (const schemeName of derivationSchemeNames) {
    const paths = derivationPathSchemes[schemeName].generator(
      [...existingDerivationPaths, ...derivedPaths],
      pathLimitPerDerivationScheme,
    );
    derivedPathsPerScheme[schemeName] = paths;
    derivedPaths.push(...paths);
  }

  return derivedPathsPerScheme;
}
