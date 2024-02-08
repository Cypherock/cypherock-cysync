import {
  ISignMessageEvent,
  ISignMessageParams,
} from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Observable, Subscriber } from 'rxjs';

import logger from '../utils/logger';

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

export interface IMakeSignMessageObservableParams<T extends App>
  extends ISignMessageParams {
  createApp: (connection: IDeviceConnection) => Promise<T>;
  signMessageFromDevice: SignMessageFromDevice<T>;
}

export function makeSignMessageObservable<
  T extends App,
  K extends ISignMessageEvent,
>(params: IMakeSignMessageObservableParams<T>) {
  return new Observable<K>(observer => {
    let finished = false;
    let app: T | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting sign message');
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
        const { connection, account, payload } = params;
        app = await params.createApp(connection);
        const signedMessage = await params.signMessageFromDevice({
          ...params,
          app,
          observer,
          account,
          payload,
        });

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
