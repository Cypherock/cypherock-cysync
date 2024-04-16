import {
  ICreatedAccount,
  ICreateAccountEvent,
  ICreateAccountParams,
  IDerivationScheme,
} from '@cypherock/coin-support-interfaces';
import { BigNumber, sleep } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Observable } from 'rxjs';

import {
  generateAddressesPerScheme,
  GetAddressesFromDevice,
} from './generateAddresses';
import { generateDerivationPathsPerScheme } from './schemes';

import logger from '../utils/logger';

interface App {
  abort: () => Promise<void>;
}

export interface IMakeCreateAccountsObservableParams<T extends App>
  extends ICreateAccountParams {
  derivationPathSchemes: Record<string, IDerivationScheme | undefined>;
  derivationPathLimit: number;
  createApp: (connection: IDeviceConnection) => Promise<T>;
  getAddressesFromDevice: GetAddressesFromDevice<T>;
  getBalanceAndTxnCount: (
    address: string,
    params: ICreateAccountParams,
  ) => Promise<{ balance: string; txnCount: number }>;
  createAccountFromAddress: (
    addressDetails: {
      address: string;
      derivationPath: string;
      index: number;
      schemeName: string;
      balance: string;
      txnCount: number;
    },
    params: ICreateAccountParams & { existingAccounts: IAccount[] },
  ) => Promise<ICreatedAccount>;
}

export function makeCreateAccountsObservable<
  T extends App,
  K extends ICreateAccountEvent,
>(params: IMakeCreateAccountsObservableParams<T>) {
  return new Observable<K>(observer => {
    let finished = false;
    let app: T | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting create account');
          logger.warn(error);
        }
      }
    };

    const unsubscribe = () => {
      if (!finished) {
        finished = true;
        cleanUp();
      }
    };

    const main = async () => {
      try {
        const existingAccounts = await params.db.account.getAll({
          walletId: params.walletId,
          assetId: params.coinId,
        });

        const derivationPathsPerScheme = await generateDerivationPathsPerScheme(
          {
            ...params,
            limit: params.derivationPathLimit,
            existingAccounts,
          },
        );
        if (finished) return;

        app = await params.createApp(params.connection);
        const addressesPerScheme = await generateAddressesPerScheme({
          ...params,
          app,
          derivationPathsPerScheme,
          observer,
        });
        if (finished) return;

        const schemeNameList = Object.keys(addressesPerScheme);

        for (const schemeName of schemeNameList) {
          const derivationSchemeDetails =
            params.derivationPathSchemes[schemeName];

          // Some derivation scheme might not be supported by the coin
          if (!derivationSchemeDetails) {
            continue;
          }

          const { threshold, newAccountLimit } = derivationSchemeDetails;
          const addresses = addressesPerScheme[schemeName];

          let zeroTxnAddressCount = 0;
          let isThresholdReached = false;

          for (const address of addresses) {
            if (finished) return;

            const { balance, txnCount } = await params.getBalanceAndTxnCount(
              address.address,
              params,
            );

            if (txnCount <= 0 && new BigNumber(balance).isZero()) {
              zeroTxnAddressCount += 1;
              isThresholdReached = zeroTxnAddressCount >= threshold;
            }

            const account = await params.createAccountFromAddress(
              {
                ...address,
                schemeName,
                balance,
                txnCount,
              },
              { ...params, existingAccounts },
            );

            if (newAccountLimit >= zeroTxnAddressCount) {
              observer.next({ type: 'Account', account } as any);
            }

            await sleep(params.waitInMSBetweenEachAccountAPI ?? 500);

            if (isThresholdReached) {
              break;
            }
          }
        }

        finished = true;
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
}
