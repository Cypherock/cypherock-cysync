import { evmCoinList } from '@cypherock/coins';
import {
  EvmApp,
  IGetPublicKeysDerivationPath,
  GetPublicKeysStatus,
} from '@cypherock/sdk-app-evm';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable, Subscriber } from 'rxjs';

import { derivationPathSchemes } from './schemes';
import { DerivationSchemeName } from './schemes/types';
import {
  ICreateAccountParams,
  ICreateAccountEvent,
  IEvmAccount,
} from './types';

import { getBalance, getTransactionCount } from '../../services';

const DERIVATION_PATH_LIMIT = 50;

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export const createAccounts = (
  params: ICreateAccountParams,
): Observable<ICreateAccountEvent> =>
  new Observable(observer => {
    let finished = false;
    let app: EvmApp | undefined;

    const cleanUp = () => {
      if (app) {
        app.destroy();

        // TODO: Add this in SDK
        // app.abort();
      }
    };

    const unsubscribe = () => {
      finished = true;
      cleanUp();
    };

    const main = async () => {
      try {
        const { connection, walletId, coinId } = params;

        const derivationPathsPerScheme = await generateDerivationPaths(params);
        if (finished) return;

        app = await EvmApp.create(connection);
        const addressesPerScheme = await generateAddresses({
          app,
          walletId,
          derivationPathsPerScheme,
          coinId,
          observer,
        });
        if (finished) return;

        const schemeNameList = Object.keys(
          addressesPerScheme,
        ) as DerivationSchemeName[];

        for (const schemeName of schemeNameList) {
          const addresses = addressesPerScheme[schemeName];
          const { threshold } = derivationPathSchemes[schemeName];

          let zeroTxnAddressCount = 0;
          let isThresholdReached = false;

          for (const address of addresses) {
            if (finished) return;

            const txnCount = await getTransactionCount(address.address, coinId);
            const balance = await getBalance(address.address, coinId);

            if (txnCount <= 0) {
              zeroTxnAddressCount += 1;
              isThresholdReached = zeroTxnAddressCount >= threshold;
            }

            const account = {
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
            } as IEvmAccount;

            observer.next({ type: 'Account', account });

            await sleep(params.waitInMSBetweenEachAccountAPI ?? 500);

            if (isThresholdReached) {
              break;
            }
          }
        }

        observer.complete();
      } catch (error) {
        if (!finished) {
          observer.error(error);
        }
      }
    };

    main();

    return unsubscribe;
  });

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

async function generateAddresses(params: {
  walletId: string;
  derivationPathsPerScheme: Record<string, string[]>;
  coinId: string;
  app: EvmApp;
  observer: Subscriber<ICreateAccountEvent>;
}) {
  const { app, walletId, derivationPathsPerScheme, coinId, observer } = params;
  const allDerivationPaths = Object.values(derivationPathsPerScheme).reduce(
    (a, b) => [...a, ...b],
    [],
  );
  const mappedDerivationPaths = allDerivationPaths.map(mapDerivationPath);

  const events: Record<GetPublicKeysStatus, boolean | undefined> = {} as any;

  const { publicKeys } = await app.getPublicKeys({
    walletId: hexToUint8Array(walletId),
    derivationPaths: mappedDerivationPaths,
    chainId: evmCoinList[coinId].chain,
    onEvent: event => {
      events[event] = true;
      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  const publicKeysPerScheme: Record<
    string,
    { address: string; derivationPath: string }[]
  > = {};

  let index = 0;
  const mapPublicKeys = (path: string, i: number) => ({
    address: publicKeys[index + i].toLowerCase(),
    derivationPath: path,
  });

  for (const schemeName of Object.keys(derivationPathsPerScheme)) {
    const paths = derivationPathsPerScheme[schemeName];
    publicKeysPerScheme[schemeName] = paths.map(mapPublicKeys);
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
