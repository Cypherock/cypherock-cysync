import {
  InheritanceApp,
  WalletAuthEvent,
} from '@cypherock/sdk-app-inheritance';
import { hexToUint8Array, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  IInheritanceWalletAuthEvent,
  IInheritanceWalletAuthParams,
  InheritanceWalletAuthDeviceEvent,
} from './types';

import logger from '../../utils/logger';

const walletAuthToDeviceEventMap: Partial<
  Record<WalletAuthEvent, InheritanceWalletAuthDeviceEvent | undefined>
> = {
  [WalletAuthEvent.INIT]: InheritanceWalletAuthDeviceEvent.INIT,
  [WalletAuthEvent.CARD_TAP]: InheritanceWalletAuthDeviceEvent.CARD_TAP,
};

export const walletAuth = (
  params: IInheritanceWalletAuthParams,
): Observable<IInheritanceWalletAuthEvent> =>
  new Observable<IInheritanceWalletAuthEvent>(observer => {
    let finished = false;
    let app: InheritanceApp | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting inheritance wallet auth');
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
        const { walletId, connection, isPublicKey, challenge } = params;

        const events: Record<number, boolean | undefined> = {} as any;

        app = await InheritanceApp.create(connection);

        const { publicKey, signature } = await app.authWallet({
          walletId: hexToUint8Array(walletId),
          challenge: hexToUint8Array(challenge),
          isPublicKey,
          onEvent: event => {
            const deviceEvent = walletAuthToDeviceEventMap[event];
            if (deviceEvent !== undefined) {
              events[deviceEvent] = true;
            }

            observer.next({
              type: 'Device',
              device: { isDone: false, events },
            });
          },
        });

        observer.next({ type: 'Device', device: { isDone: true, events } });
        observer.next({
          type: 'Result',
          signature: uint8ArrayToHex(signature),
          publicKey: uint8ArrayToHex(publicKey),
        });

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
