import { IInheritanceEncryptMessageEvent } from '@cypherock/app-support-inheritance';
import lodash from 'lodash';
import { useState, useRef, useCallback } from 'react';
import { Subscription, Observer } from 'rxjs';

import { deviceLock, useDevice } from '~/context';
import { inheritanceSupport } from '~/utils';
import logger from '~/utils/logger';

export const useEncryptMessage = (onErrorCallback: (e?: any) => void) => {
  const { connection } = useDevice();

  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const flowSubscription = useRef<Subscription | undefined>();
  const walletIdRef = useRef<string | undefined>();
  const [encryptedMessages, setEncryptedMessages] = useState<
    string | undefined
  >();
  const [isEncrypted, setIsEncrypted] = useState(false);

  const cleanUp = useCallback(() => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  }, []);

  const onError = useCallback(
    (e?: any) => {
      console.log(e);
      logger.error('Error on inheritance encrypt message flow');
      logger.error(e);
      cleanUp();
      onErrorCallback(e);
    },
    [onErrorCallback, cleanUp],
  );

  const getFlowObserver = useCallback(
    (onEnd: () => void): Observer<IInheritanceEncryptMessageEvent> => ({
      next: payload => {
        if (payload.device) setDeviceEvents({ ...payload.device.events });
        if (payload.encryptedMessages) {
          setEncryptedMessages(payload.encryptedMessages);
          setIsEncrypted(true);
        }
      },
      error: err => {
        onEnd();
        onError(err);
      },
      complete: () => {
        cleanUp();
        onEnd();
      },
    }),
    [onError],
  );

  const start = useCallback(
    async (
      walletId: string,
      messages?: { personalMessage?: string; cardLocation?: string },
    ) => {
      logger.info('Starting inheritance encrypt message');

      if (!connection?.connection) {
        return;
      }

      let onEnd: (() => void) | undefined;
      try {
        cleanUp();
        walletIdRef.current = walletId;

        const taskId = lodash.uniqueId('task-');

        await deviceLock.acquire(connection.device, taskId);

        onEnd = () => {
          deviceLock.release(connection.device, taskId);
        };

        const deviceConnection = connection.connection;

        flowSubscription.current = inheritanceSupport
          .encryptMessageWithPin({
            connection: deviceConnection,
            walletId: walletIdRef.current,
            personalMessage: messages?.personalMessage,
            cardLocation: messages?.cardLocation,
          })
          .subscribe(getFlowObserver(onEnd));
      } catch (e) {
        if (onEnd) {
          onEnd();
        }
        onError(e);
      }
    },
    [connection],
  );

  const reset = useCallback(() => {
    walletIdRef.current = undefined;
    setIsEncrypted(false);
    setEncryptedMessages(undefined);
    setDeviceEvents({});
    cleanUp();
  }, [cleanUp]);

  return {
    deviceEvents,
    reset,
    abort: cleanUp,
    start,
    encryptedMessages,
    isEncrypted,
  };
};
