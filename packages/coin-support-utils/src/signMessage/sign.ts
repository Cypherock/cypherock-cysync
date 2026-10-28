import {
  ISignMessageEvent,
  ISignMessageParams,
  IX0Session,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Observable, Subscriber } from 'rxjs';

import logger from '../utils/logger';
import { assertX0WalletId, resolveExecutionContext } from '../x0';

interface App {
  abort: () => Promise<void>;
}

export interface ISignMessageFromDeviceParams<T> extends ISignMessageParams {
  observer: Subscriber<ISignMessageEvent>;
  app: T;
  account: IAccount;
}

export type SignMessageFromDevice<T> = (
  params: ISignMessageFromDeviceParams<T>,
) => Promise<string>;

export interface ISignMessageFromX0Params extends ISignMessageParams {
  observer: Subscriber<ISignMessageEvent>;
  x0: IX0Session;
  account: IAccount;
}

export type SignMessageFromX0 = (
  params: ISignMessageFromX0Params,
) => Promise<string>;

export interface IMakeSignMessageObservableParams<T extends App>
  extends ISignMessageParams {
  createApp: (connection: IDeviceConnection) => Promise<T>;
  signMessageFromDevice: SignMessageFromDevice<T>;
  signMessageFromX0?: SignMessageFromX0;
}

export function makeSignMessageObservable<
  T extends App,
  K extends ISignMessageEvent,
>(params: IMakeSignMessageObservableParams<T>) {
  return new Observable<K>(observer => {
    let finished = false;
    let app: T | undefined;
    let x0Session: IX0Session | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting sign message');
          logger.warn(error);
        }
      }

      if (x0Session) {
        try {
          await x0Session.abort();
        } catch (error) {
          logger.warn('Error in aborting sign message on X0');
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
        const { account, payload } = params;
        const executionContext = resolveExecutionContext(params);
        let signedMessage: string;

        if (executionContext.type === 'x0') {
          const { signMessageFromX0 } = params;
          if (!signMessageFromX0) {
            throw new Error('X0 is not supported for this coin: signMessage');
          }

          assertX0WalletId(executionContext.x0, account.walletId);
          x0Session = executionContext.x0;
          signedMessage = await signMessageFromX0({
            ...params,
            x0: x0Session,
            observer,
            account,
            payload,
          });
        } else {
          app = await params.createApp(executionContext.connection);
          signedMessage = await params.signMessageFromDevice({
            ...params,
            app,
            observer,
            account,
            payload,
          });
        }

        if (finished) return;

        const event: ISignMessageEvent = {
          type: 'Message',
          signature: signedMessage,
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
