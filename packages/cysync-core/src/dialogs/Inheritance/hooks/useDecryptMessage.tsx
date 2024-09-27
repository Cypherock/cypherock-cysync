import { IInheritanceDecryptMessageEvent } from '@cypherock/app-support-inheritance';
import lodash from 'lodash';
import { useState, useRef, useCallback } from 'react';
import { Subscription, Observer } from 'rxjs';

import { deviceLock, useDevice } from '~/context';
import { inheritanceSupport } from '~/utils';
import logger from '~/utils/logger';

export const useDecryptMessage = (onErrorCallback: (e?: any) => void) => {
  const { connection } = useDevice();

  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const flowSubscription = useRef<Subscription | undefined>();
  const walletIdRef = useRef<string | undefined>();
  const [decryptedMessages, setDecryptedMessages] = useState<
    Record<number, string | undefined> | undefined
  >();
  const [isDecrypted, setIsDecrypted] = useState(false);

  const cleanUp = useCallback(() => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  }, []);

  const onError = useCallback(
    (e?: any) => {
      console.log(e);
      logger.error('Error on inheritance decrypt message flow');
      logger.error(e);
      cleanUp();
      onErrorCallback(e);
    },
    [onErrorCallback, cleanUp],
  );

  const getFlowObserver = useCallback(
    (onEnd: () => void): Observer<IInheritanceDecryptMessageEvent> => ({
      next: payload => {
        if (payload.device) setDeviceEvents({ ...payload.device.events });
        if (payload.decryptedMessages) {
          setDecryptedMessages(payload.decryptedMessages);
          setIsDecrypted(true);
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
    async (walletId: string, message: string) => {
      logger.info('Starting inheritance decrypt message');

      if (!connection?.connection) {
        return;
      }

      try {
        cleanUp();
        walletIdRef.current = walletId;

        const taskId = lodash.uniqueId('task-');

        await deviceLock.acquire(connection.device, taskId);

        const onEnd = () => {
          deviceLock.release(connection.device, taskId);
        };

        const deviceConnection = connection.connection;

        flowSubscription.current = inheritanceSupport
          .decryptMessageWithPin({
            connection: deviceConnection,
            walletId: walletIdRef.current,
            message,
          })
          .subscribe(getFlowObserver(onEnd));
      } catch (e) {
        onError(e);
      }
    },
    [connection],
  );

  const reset = useCallback(() => {
    walletIdRef.current = undefined;
    setIsDecrypted(false);
    setDecryptedMessages(undefined);
    setDeviceEvents({});
    cleanUp();
  }, [cleanUp]);

  return {
    deviceEvents,
    reset,
    abort: cleanUp,
    start,
    decryptedMessages,
    isDecrypted,
  };
};
