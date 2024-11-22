import {
  IInheritanceWalletAuthEvent,
  IInheritanceWalletAuthParams,
} from '@cypherock/app-support-inheritance';
import lodash from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Observer, Subscription } from 'rxjs';

import { deviceLock, useDevice } from '~/context';
import { inheritanceSupport } from '~/utils';
import logger from '~/utils/logger';

export const useWalletAuthDevice = (
  onErrorCallback: (e?: any) => void,
  onSuccessCallback: () => void,
) => {
  const { connection } = useDevice();

  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const deviceResponse = useRef<
    | {
        walletBased?: { publicKey?: string; signature: string };
        seedBased?: { publicKey?: string; signature: string };
      }
    | undefined
  >();
  const flowSubscription = useRef<Subscription | undefined>();

  const cleanUp = useCallback(() => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  }, []);

  const onError = useCallback(
    (e?: any) => {
      logger.error('Error on useWalletAuthDevice');
      logger.error(e);
      cleanUp();
      onErrorCallback(e);
    },
    [onErrorCallback, cleanUp],
  );

  const getFlowObserver = useCallback(
    (onEnd: () => void): Observer<IInheritanceWalletAuthEvent> => ({
      next: payload => {
        if (payload.device) setDeviceEvents({ ...payload.device.events });
        if (payload.walletBased) {
          deviceResponse.current = {
            ...(deviceResponse.current ?? {}),
            walletBased: payload.walletBased,
          };
        }
        if (payload.seedBased) {
          deviceResponse.current = {
            ...(deviceResponse.current ?? {}),
            seedBased: payload.seedBased,
          };
        }
      },
      error: err => {
        onEnd();
        onError(err);
      },
      complete: () => {
        onSuccessCallback();
        cleanUp();
        onEnd();
      },
    }),
    [onError],
  );

  const startWalletAuth = useCallback(
    async (params: Omit<IInheritanceWalletAuthParams, 'connection'>) => {
      logger.info('Starting wallet auth');

      if (!connection?.connection) {
        return;
      }

      try {
        cleanUp();

        const taskId = lodash.uniqueId('task-');

        await deviceLock.acquire(connection.device, taskId);

        const onEnd = () => {
          deviceLock.release(connection.device, taskId);
        };

        const deviceConnection = connection.connection;

        flowSubscription.current = inheritanceSupport
          .walletAuth({
            connection: deviceConnection,
            ...params,
          })
          .subscribe(getFlowObserver(onEnd));
      } catch (e) {
        onError(e);
      }
    },
    [connection],
  );

  const reset = useCallback(() => {
    deviceResponse.current = undefined;
    setDeviceEvents({});
    cleanUp();
  }, [cleanUp]);

  return useMemo(
    () => ({
      cleanUp,
      deviceResponse,
      startWalletAuth,
      deviceEvents,
      reset,
    }),
    [cleanUp, startWalletAuth, deviceEvents, reset, deviceResponse],
  );
};
