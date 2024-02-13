import {
  ISignTransactionEvent,
  ISignTransactionParams,
} from '@cypherock/coin-support-interfaces';
import { coinList, ICoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Observable, Subscriber } from 'rxjs';

import { getAccountAndCoin } from '../db';
import logger from '../utils/logger';

interface App {
  abort: () => Promise<void>;
}

export interface ISignTransactionFromDeviceParams<T>
  extends ISignTransactionParams {
  observer: Subscriber<ISignTransactionEvent>;
  app: T;
  account: IAccount;
  coin: ICoinInfo;
}

export type SignTransactionFromDevice<T> = (
  params: ISignTransactionFromDeviceParams<T>,
) => Promise<string>;

export interface IMakeSignTransactionsObservableParams<T extends App>
  extends ISignTransactionParams {
  createApp: (connection: IDeviceConnection) => Promise<T>;
  signTransactionFromDevice: SignTransactionFromDevice<T>;
}

export function makeSignTransactionsObservable<
  T extends App,
  K extends ISignTransactionEvent,
>(params: IMakeSignTransactionsObservableParams<T>) {
  return new Observable<K>(observer => {
    let finished = false;
    let app: T | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting sign transaction');
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
        const { account, coin } = await getAccountAndCoin(
          params.db,
          coinList,
          params.transaction.accountId,
        );

        app = await params.createApp(params.connection);
        const signedTransaction = await params.signTransactionFromDevice({
          ...params,
          app,
          observer,
          account,
          coin,
        });

        if (finished) return;

        const event: ISignTransactionEvent = {
          type: 'Transaction',
          transaction: signedTransaction,
        };

        observer.next(event as any);

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
