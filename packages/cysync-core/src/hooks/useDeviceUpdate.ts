import { ManagerApp, UpdateFirmwareStatus } from '@cypherock/sdk-app-manager';
import { useEffect, useRef, useState } from 'react';
import semver from 'semver';

import { IDeviceConnectionInfo, useDevice } from '..';

import { DeviceTask, useDeviceTask, useStateWithRef } from '.';

export enum DeviceUpdateState {
  Checking,
  Confirmation,
  Updating,
  Successful,
  NotRequired,
}

enum InternalState {
  Checking,
  Installing,
}

export const useDeviceUpdate = () => {
  const { connection, connectDevice, getDevices } = useDevice();
  const [state, setState] = useState(DeviceUpdateState.Checking);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [internalState, setInternalState] = useState(InternalState.Checking);
  const [version, setVersion, versionRef] = useStateWithRef<string | undefined>(
    undefined,
  );
  const firmwareRef = useRef<Uint8Array | undefined>(undefined);
  const [errorToShow, setErrorToShow] = useState<Error | undefined>();

  const connectionRef = useRef<IDeviceConnectionInfo | undefined>(connection);

  useEffect(() => {
    connectionRef.current = connection;
  }, []);

  const setStateWithResetError = (s: DeviceUpdateState) => {
    setErrorToShow(undefined);
    setState(s);
  };

  const updateFirmwareTask: DeviceTask<void> = async con => {
    const app = await ManagerApp.create(con);
    const versionArr = versionRef.current?.split('.') ?? [];

    await app.updateFirmware({
      firmware: firmwareRef.current,
      version: {
        major: parseInt(versionArr[0], 10),
        minor: parseInt(versionArr[1], 10),
        patch: parseInt(versionArr[2], 10),
      },
      getDevices,
      createConnection: connectDevice,
      onProgress: setDownloadProgress,
      allowPrerelease: window.cysyncEnv.ALLOW_PRERELEASE === 'true',
      onEvent: e => {
        if (e === UpdateFirmwareStatus.UPDATE_FIRMWARE_STATUS_USER_CONFIRMED) {
          setState(DeviceUpdateState.Updating);
        }
      },
    });
  };

  const task = useDeviceTask(updateFirmwareTask, { dontExecuteTask: true });

  const onError = (error: any) => {
    setErrorToShow(error);
  };

  const installUpdate = async () => {
    try {
      if (task.isRunning) return;

      setInternalState(InternalState.Installing);
      setStateWithResetError(DeviceUpdateState.Confirmation);
      setDownloadProgress(0);

      const { error } = await task.run();
      if (error) throw error;

      setStateWithResetError(DeviceUpdateState.Successful);
    } catch (error) {
      onError(error);
    }
  };

  const checkForUpdates = async () => {
    try {
      setStateWithResetError(DeviceUpdateState.Checking);
      const result = await ManagerApp.getLatestFirmware({
        prerelease: window.cysyncEnv.ALLOW_PRERELEASE === 'true',
        doDownload: true,
      });
      setVersion(result.version);
      firmwareRef.current = result.firmware;

      if (
        connection?.firmwareVersion &&
        semver.gte(connection.firmwareVersion, result.version)
      ) {
        setStateWithResetError(DeviceUpdateState.NotRequired);
        return;
      }

      installUpdate();
      setStateWithResetError(DeviceUpdateState.Confirmation);
    } catch (error) {
      onError(error);
    }
  };

  const onRetry = () => {
    const retryFuncMap: Record<InternalState, () => Promise<void>> = {
      [InternalState.Checking]: checkForUpdates,
      [InternalState.Installing]: installUpdate,
    };

    retryFuncMap[internalState]();
  };

  useEffect(() => {
    checkForUpdates();

    return () => {
      task.abort();
    };
  }, []);

  return { state, downloadProgress, version, errorToShow, onRetry, connection };
};
