import {
  DecryptMessagesWithPinEvent,
  InheritanceApp,
} from '@cypherock/sdk-app-inheritance';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  IInheritanceDecryptMessageEvent,
  IInheritanceDecryptMessageParams,
  InheritanceDecryptMessageDeviceEvent,
} from './types';

import logger from '../../utils/logger';

const decryptMessageToDeviceEventMap: Partial<
  Record<
    DecryptMessagesWithPinEvent,
    InheritanceDecryptMessageDeviceEvent | undefined
  >
> = {
  [DecryptMessagesWithPinEvent.INIT]: InheritanceDecryptMessageDeviceEvent.INIT,
  [DecryptMessagesWithPinEvent.CONFIRMED]:
    InheritanceDecryptMessageDeviceEvent.CONFIRMED,
  [DecryptMessagesWithPinEvent.MESSAGE_DECRYPTED_CARD_TAP]:
    InheritanceDecryptMessageDeviceEvent.CARD_TAPPED,
  [DecryptMessagesWithPinEvent.PIN_VERIFIED]:
    InheritanceDecryptMessageDeviceEvent.PIN_VERIFIED,
};

export const decryptMessage = (
  params: IInheritanceDecryptMessageParams,
): Observable<IInheritanceDecryptMessageEvent> =>
  new Observable<IInheritanceDecryptMessageEvent>(observer => {
    let finished = false;
    let app: InheritanceApp | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting inheritance decryptMessage');
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
        const { walletId, connection, message } = params;

        const events: Record<number, boolean | undefined> = {} as any;

        app = await InheritanceApp.create(connection);

        const decryptedMessages = await app.decryptMessagesWithPin({
          walletId: hexToUint8Array(walletId),
          encryptedData: hexToUint8Array(message),
          onEvent: event => {
            const deviceEvent = decryptMessageToDeviceEventMap[event];
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
          decryptedMessages: Object.entries(decryptedMessages).reduce(
            (a, [key, value]) => ({
              ...a,
              [key]: value.dataAsString,
            }),
            {},
          ),
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
