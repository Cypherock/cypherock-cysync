import {
  EncryptMessagesWithPinEvent,
  InheritanceApp,
} from '@cypherock/sdk-app-inheritance';
import { hexToUint8Array, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  IInheritanceEncryptMessageEvent,
  IInheritanceEncryptMessageParams,
  InheritanceEncryptMessageDeviceEvent,
} from './types';

import logger from '../../utils/logger';

const encryptMessageToDeviceEventMap: Partial<
  Record<
    EncryptMessagesWithPinEvent,
    InheritanceEncryptMessageDeviceEvent | undefined
  >
> = {
  [EncryptMessagesWithPinEvent.INIT]: InheritanceEncryptMessageDeviceEvent.INIT,
  [EncryptMessagesWithPinEvent.CONFIRMED]:
    InheritanceEncryptMessageDeviceEvent.CONFIRMED,
  [EncryptMessagesWithPinEvent.MESSAGE_VERIFIED]:
    InheritanceEncryptMessageDeviceEvent.VERIFIED,
  [EncryptMessagesWithPinEvent.PIN_ENTERED]:
    InheritanceEncryptMessageDeviceEvent.CARD_TAPPED,
};

export const encryptMessage = (
  params: IInheritanceEncryptMessageParams,
): Observable<IInheritanceEncryptMessageEvent> =>
  new Observable<IInheritanceEncryptMessageEvent>(observer => {
    let finished = false;
    let app: InheritanceApp | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting inheritance encryptMessage');
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
        const { walletId, connection, messages } = params;

        const events: Record<number, boolean | undefined> = {} as any;

        app = await InheritanceApp.create(connection);

        const { encryptedPacket } = await app.encryptMessagesWithPin({
          walletId: hexToUint8Array(walletId),
          messages: messages.map(m => ({
            value: m,
          })),
          onEvent: event => {
            const deviceEvent = encryptMessageToDeviceEventMap[event];
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
          encryptedMessages: uint8ArrayToHex(encryptedPacket),
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
