import { hexToUint8Array } from '@cypherock/sdk-utils';
import { EvmApp, IGetPublicKeysDerivationPath } from '@cypherock/sdk-app-evm';
import { evmCoinList } from '@cypherock/coins';

import { derivationPathSchemes } from './schemes';
import { DerivationSchemeName } from './schemes/types';
import { ICreateAccountParams, IEvmAccount } from './types';
import { getBalance, getTransactionCount } from '../../services';

const DERIVATION_PATH_LIMIT = 50;

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export const createAccounts = async (
  params: ICreateAccountParams,
): Promise<IEvmAccount[]> => {
  const { connection, walletId, coinId } = params;

  const derivationPathsPerScheme = await generateDerivationPaths(params);
  const addressesPerScheme = await generateAddresses(
    connection,
    walletId,
    derivationPathsPerScheme,
    coinId,
  );

  const schemeNameList = Object.keys(
    addressesPerScheme,
  ) as DerivationSchemeName[];

  const accounts: IEvmAccount[] = [];

  for (const schemeName of schemeNameList) {
    const addresses = addressesPerScheme[schemeName];
    const { threshold } = derivationPathSchemes[schemeName];

    let zeroTxnAddressCount = 0;
    let isThresholdReached = false;

    for (const address of addresses) {
      const txnCount = await getTransactionCount(address.address, coinId);
      const balance = await getBalance(address.address, coinId);

      if (txnCount <= 0) {
        zeroTxnAddressCount += 1;
        isThresholdReached = zeroTxnAddressCount >= threshold;
      }

      accounts.push({
        // TODO: name to be decided later
        name: '',
        xpubOrAddress: address.address,
        balance,
        unit: evmCoinList[coinId].units[0].abbr.toLowerCase(),
        derivationPath: address.derivationPath,
        type: 'account',
        assetId: coinId,
        walletId,
        extraData: {
          derivationScheme: schemeName,
        },
      } as IEvmAccount);

      await sleep(params.waitInMSBetweenEachAccountAPI ?? 500);

      if (isThresholdReached) {
        break;
      }
    }
  }

  return accounts;
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
  const mappedDerivationPaths = allDerivationPaths.map(mapDerivationPath);

  const app = await EvmApp.create(connection);
  const { publicKeys } = await app.getPublicKeys({
    walletId: hexToUint8Array(walletId),
    derivationPaths: mappedDerivationPaths,
    chainId: evmCoinList[coinId].chain,
  });
  const publicKeysPerScheme: Record<
    string,
    Array<{ address: string; derivationPath: string }>
  > = {};

  let index = 0;
  for (const schemeName of Object.keys(derivationPaths)) {
    const paths = derivationPaths[schemeName];
    // eslint-disable-next-line no-loop-func
    publicKeysPerScheme[schemeName] = paths.map((path, i) => ({
      address: publicKeys[index + i].toLowerCase(),
      derivationPath: path,
    }));
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
      // This is done because there can be overlapping derivation paths
      // between different schemes
      [...existingDerivationPaths, ...derivedPaths],
      pathLimitPerDerivationScheme,
    );
    derivedPathsPerScheme[schemeName] = paths;
    derivedPaths.push(...paths);
  }

  return derivedPathsPerScheme;
}
