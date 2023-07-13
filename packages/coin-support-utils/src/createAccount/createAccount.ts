import {
  ICreateAccountEvent,
  ICreateAccountParams,
  IDerivationScheme,
} from '@cypherock/coin-support-interfaces';
import { sleep } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Observable } from 'rxjs';

import {
  generateAddressesPerScheme,
  GetAddressesFromDevice,
} from './generateAddresses';
import { generateDerivationPathsPerScheme } from './schemes';

export interface App {
  destroy: () => Promise<void>;
}

export interface ICreateAccountsObservableParams<T extends App>
  extends ICreateAccountParams {
  derivationPathSchemes: Record<string, IDerivationScheme>;
  derivationPathLimit: number;
  createApp: (connection: IDeviceConnection) => Promise<T>;
  getAddressesFromDevice: GetAddressesFromDevice<T>;
  getTransactionCount: (
    address: string,
    params: ICreateAccountParams,
  ) => Promise<number>;
  getBalance: (
    address: string,
    params: ICreateAccountParams,
  ) => Promise<string>;
  createAccountFromAddress: (
    addressDetails: {
      address: string;
      derivationPath: string;
      schemeName: string;
      balance: string;
      txnCount: number;
    },
    params: ICreateAccountParams,
  ) => Promise<IAccount>;
}

export function createAccountsObservable<
  T extends App,
  K extends ICreateAccountEvent,
>(params: ICreateAccountsObservableParams<T>) {
  return new Observable<K>(observer => {
    let finished = false;
    let app: T | undefined;

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
        const derivationPathsPerScheme = await generateDerivationPathsPerScheme(
          {
            ...params,
            limit: params.derivationPathLimit,
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
          const addresses = addressesPerScheme[schemeName];
          const { threshold } = params.derivationPathSchemes[schemeName];

          let zeroTxnAddressCount = 0;
          let isThresholdReached = false;

          for (const address of addresses) {
            if (finished) return;

            const txnCount = await params.getTransactionCount(
              address.address,
              params,
            );
            const balance = await params.getBalance(address.address, params);

            if (txnCount <= 0) {
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
              params,
            );

            observer.next({ type: 'Account', account } as any);

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
}
