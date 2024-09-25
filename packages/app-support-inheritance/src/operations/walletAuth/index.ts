import {
  InheritanceApp,
  AuthWalletEvent,
  IAuthWalletSignatureAndKey,
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
  Record<AuthWalletEvent, InheritanceWalletAuthDeviceEvent | undefined>
> = {
  [AuthWalletEvent.INIT]: InheritanceWalletAuthDeviceEvent.INIT,
  [AuthWalletEvent.CONFIRMED]: InheritanceWalletAuthDeviceEvent.CONFIRMED,
  [AuthWalletEvent.SEED_BASED_CARD_TAP]:
    InheritanceWalletAuthDeviceEvent.SEED_BASED_CARD_TAPPED,
  [AuthWalletEvent.CARD_PAIRING_CARD_TAP]:
    InheritanceWalletAuthDeviceEvent.CARD_PAIRING_CARD_TAPPED,
  [AuthWalletEvent.WALLET_BASED_CARD_TAP]:
    InheritanceWalletAuthDeviceEvent.WALLET_BASED_CARD_TAPPED,
};

const parseSignatureAndKey = (params?: IAuthWalletSignatureAndKey) => {
  if (!params) {
    return undefined;
  }

  return {
    signature: uint8ArrayToHex(params.signature),
    publicKey: params.publicKey ? uint8ArrayToHex(params.publicKey) : undefined,
  };
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
        const { walletId, connection, isPublicKey, challenge, type } = params;

        const events: Record<number, boolean | undefined> = {} as any;

        app = await InheritanceApp.create(connection);

        const { walletBased, seedBased } = await app.authWallet({
          walletId: hexToUint8Array(walletId),
          challenge: hexToUint8Array(challenge),
          type,
          withPublicKey: isPublicKey,
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
          walletBased: parseSignatureAndKey(walletBased),
          seedBased: parseSignatureAndKey(seedBased),
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
