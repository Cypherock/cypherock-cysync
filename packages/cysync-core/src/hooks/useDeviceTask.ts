import React, { useEffect } from 'react';
import { IDevice, IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';
import * as lodash from 'lodash';

import { deviceLock, useDevice } from '~/context';
import logger from '~/utils/logger';

export type DeviceTask<T> = (connection: IDeviceConnection) => Promise<T>;

export interface DeviceTaskOptions {
  dontExecuteTask: boolean;
}

export function useDeviceTask<T>(
  handler: DeviceTask<T>,
  options?: DeviceTaskOptions,
) {
  const { connection, connectDevice } = useDevice();

  const [taskError, setTaskError] = React.useState<Error | undefined>();
  const [taskResult, setTaskResult] = React.useState<T | undefined>();

  const connectedRef = React.useRef<
    { connection: IDeviceConnection; device: IDevice } | undefined
  >();
  const isAbortedRef = React.useRef<boolean>(false);

  const run = async () => {
    let conn: IDeviceConnection | undefined;
    const taskId = lodash.uniqueId('task-');

    try {
      isAbortedRef.current = false;
      setTaskError(undefined);
      connectedRef.current = undefined;

      if (!connection) return;

      await deviceLock.acquire(connection.device, taskId);
      conn = await connectDevice(connection.device);
      connectedRef.current = { connection: conn, device: connection.device };
      const res = await handler(conn);

      setTaskResult(res);

      // Don't abort if no error
      isAbortedRef.current = true;
    } catch (error: any) {
      if (!isAbortedRef.current) {
        logger.error(error);
        setTaskError(error);
      }

      // If an error occured, no need to abort
      isAbortedRef.current = true;
    } finally {
      if (connection?.device) {
        deviceLock.release(connection.device, taskId);
      }
      conn?.destroy().catch(() => {});
    }
  };

  const abort = async () => {
    try {
      if (isAbortedRef.current) {
        return;
      }

      isAbortedRef.current = true;

      if (connectedRef.current) {
        await SDK.sendAbort(connectedRef.current.connection);
        await connectedRef.current.connection.destroy();
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  useEffect(() => {
    const doExecute = !options?.dontExecuteTask;

    if (doExecute) {
      run();
    }

    return () => {
      if (doExecute) {
        abort();
      }
    };
  }, []);

  return {
    run,
    abort,
    error: taskError,
    result: taskResult,
  };
}
