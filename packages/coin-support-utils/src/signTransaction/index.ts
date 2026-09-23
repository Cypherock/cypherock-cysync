import {
  ISignTransactionEvent,
  ISignTransactionParams,
  IX0Session,
} from '@cypherock/coin-support-interfaces';
import { coinList, ICoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Observable, Subscriber } from 'rxjs';

import { getAccountAndCoin } from '../db';
import logger from '../utils/logger';
import { assertX0WalletId, resolveExecutionContext } from '../x0';

interface App {
  abort: () => Promise<void>;
}

export interface ISignTransactionFromDeviceParams<T, R>
  extends ISignTransactionParams {
  observer: Subscriber<ISignTransactionEvent<R>>;
  app: T;
  account: IAccount;
  coin: ICoinInfo;
}

export type SignTransactionFromDevice<T, R> = (
  params: ISignTransactionFromDeviceParams<T, R>,
) => Promise<R>;

export interface ISignTransactionFromX0Params<R>
  extends ISignTransactionParams {
  observer: Subscriber<ISignTransactionEvent<R>>;
  x0: IX0Session;
  account: IAccount;
  coin: ICoinInfo;
}

export type SignTransactionFromX0<R> = (
  params: ISignTransactionFromX0Params<R>,
) => Promise<R>;

export interface IMakeSignTransactionsObservableParams<T extends App, R>
  extends ISignTransactionParams {
  createApp: (connection: IDeviceConnection) => Promise<T>;
  signTransactionFromDevice: SignTransactionFromDevice<T, R>;
  signTransactionFromX0?: SignTransactionFromX0<R>;
}

export function makeSignTransactionsObservable<
  T extends App,
  K extends ISignTransactionEvent<R>,
  R,
>(params: IMakeSignTransactionsObservableParams<T, R>) {
  return new Observable<K>(observer => {
    let finished = false;
    let app: T | undefined;
    let x0Session: IX0Session | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting sign transaction');
          logger.warn(error);
        }
      }

      if (x0Session) {
        try {
          await x0Session.abort();
        } catch (error) {
          logger.warn('Error in aborting sign transaction on X0');
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
        let account: IAccount | undefined;
        let coin: ICoinInfo | undefined;

        if (params.account) {
          account = params.account;
          coin = coinList[account.parentAssetId];
        } else {
          const { account: accountFromDb, coin: coinFromDb } =
            await getAccountAndCoin(
              params.db,
              coinList,
              params.transaction.accountId,
            );
          account = accountFromDb;
          coin = coinFromDb;
        }

        const executionContext = resolveExecutionContext(params);
        let signedTransaction: R;

        if (executionContext.type === 'x0') {
          const { signTransactionFromX0 } = params;
          if (!signTransactionFromX0) {
            throw new Error(
              'X0 is not supported for this coin: signTransaction',
            );
          }

          assertX0WalletId(executionContext.x0, account.walletId);
          x0Session = executionContext.x0;
          signedTransaction = await signTransactionFromX0({
            ...params,
            x0: x0Session,
            observer,
            account,
            coin,
          });
        } else {
          app = await params.createApp(executionContext.connection);
          signedTransaction = await params.signTransactionFromDevice({
            ...params,
            app,
            observer,
            account,
            coin,
          });
        }

        if (finished) return;

        const event: any = {
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
