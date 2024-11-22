import lodash from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import { lastValueFrom } from 'rxjs';

import { deviceLock, useDevice } from '~/context';
import { useAsync } from '~/hooks';
import { inheritanceSupport } from '~/utils';
import logger from '~/utils/logger';

export const useSession = (onErrorCallback: (e?: any) => void) => {
  const { connection } = useDevice();

  const [sessionId, setSessionId] = useState<string | undefined>();
  const [sessionAge, setSessionAge] = useState<number | undefined>();
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);

  const onError = useCallback(
    (e?: any) => {
      console.log(e);
      logger.error('Error on inheritance session flow');
      logger.error(e);
      onErrorCallback(e);
    },
    [onErrorCallback],
  );

  const start = useCallback(async (): Promise<string | undefined> => {
    logger.info('Starting inheritance startSession');

    if (!connection?.connection) {
      return undefined;
    }

    setIsStartingSession(true);
    let onEnd: (() => void) | undefined;
    try {
      const taskId = lodash.uniqueId('task-');

      await deviceLock.acquire(connection.device, taskId);

      onEnd = () => {
        deviceLock.release(connection.device, taskId);
      };

      const deviceConnection = connection.connection;

      const payload = await lastValueFrom(
        inheritanceSupport.startSession({
          connection: deviceConnection,
        }),
      );
      onEnd();

      if (payload.sessionId && payload.sessionAge) {
        setIsSessionStarted(true);
        setSessionId(payload.sessionId);
        setSessionAge(payload.sessionAge);
      }

      setIsStartingSession(false);
      return payload.sessionId;
    } catch (e) {
      if (onEnd) {
        onEnd();
      }
      onError(e);
      setIsStartingSession(false);
      return undefined;
    }
  }, [connection]);

  const stopHandler = useCallback(async () => {
    logger.info('Starting inheritance stopSession');

    if (!connection?.connection) {
      return false;
    }

    let onEnd: (() => void) | undefined;
    try {
      const taskId = lodash.uniqueId('task-');

      await deviceLock.acquire(connection.device, taskId);

      onEnd = () => {
        deviceLock.release(connection.device, taskId);
      };

      const deviceConnection = connection.connection;

      await lastValueFrom(
        inheritanceSupport.stopSession({
          connection: deviceConnection,
        }),
      );

      setSessionId(undefined);
      setSessionAge(undefined);
      setIsSessionStarted(false);

      return true;
    } catch (e) {
      if (onEnd) {
        onEnd();
      }
      onError(e);
      return false;
    }
  }, [connection]);

  const [stop, isStoppingSession] = useAsync(stopHandler, onError);

  const reset = useCallback(() => {
    setIsSessionStarted(false);
    setSessionId(undefined);
    setSessionAge(undefined);
  }, []);

  useEffect(() => {
    reset();
  }, [connection]);

  const getIsActive = useCallback(async () => {
    if (!isSessionStarted) {
      return undefined;
    }

    if (sessionId && sessionAge && Date.now() < sessionAge) {
      return sessionId;
    }

    return undefined;
  }, [sessionId, sessionAge, isSessionStarted]);

  return {
    reset,
    start,
    sessionId,
    sessionAge,
    getIsActive,
    isSessionStarted,
    stop,
    isStartingSession,
    isStoppingSession,
  };
};
