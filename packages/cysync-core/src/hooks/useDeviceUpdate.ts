import { ManagerApp, UpdateFirmwareStatus } from '@cypherock/sdk-app-manager';
import { useEffect, useRef, useState } from 'react';
import semver from 'semver';

import { DeviceTask, useDeviceTask } from './useDeviceTask';

import { IDeviceConnectionInfo, useDevice } from '..';

export enum DeviceUpdateState {
  Checking,
  Confirmation,
  Updating,
  Successful,
}

export enum InternalState {
  Checking,
  Installing,
}

export const useDeviceUpdate = () => {
  const { connection, connectDevice, getDevices } = useDevice();

  const [deviceUpdateState, setDeviceUpdateState] = useState(
    DeviceUpdateState.Checking,
  );
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [internalState, setInternalState] = useState(InternalState.Checking);
  const [version, setVersion] = useState<string | undefined>();
  const [errorToShow, setErrorToShow] = useState<Error | undefined>();
  const [isUpdatesChecked, setIsUpdatesChecked] = useState<boolean>(false);
  const [shouldUpdateInstall, setShouldUpdateInstall] =
    useState<boolean>(false);

  const connectionRef = useRef<IDeviceConnectionInfo | undefined>(connection);

  useEffect(() => {
    connectionRef.current = connection;
  }, []);

  const setStateWithResetError = (s: DeviceUpdateState) => {
    setErrorToShow(undefined);
    setDeviceUpdateState(s);
  };

  const updateFirmwareTask: DeviceTask<void> = async con => {
    const app = await ManagerApp.create(con);

    await app.updateFirmware({
      getDevices,
      createConnection: connectDevice,
      onProgress: setDownloadProgress,
      allowPrerelease: window.cysyncEnv.ALLOW_PRERELEASE === 'true',
      onEvent: e => {
        if (e === UpdateFirmwareStatus.UPDATE_FIRMWARE_STATUS_USER_CONFIRMED) {
          setDeviceUpdateState(DeviceUpdateState.Updating);
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

      const error = await task.run();
      if (error) throw error;

      setStateWithResetError(DeviceUpdateState.Successful);
    } catch (error) {
      onError(error);
    }
  };

  const checkForUpdates = async () => {
    try {
      setIsUpdatesChecked(false);
      setStateWithResetError(DeviceUpdateState.Checking);
      const result = await ManagerApp.getLatestFirmware({
        prerelease: window.cysyncEnv.ALLOW_PRERELEASE === 'true',
      });
      setVersion(result.version);

      if (
        !(
          connection?.firmwareVersion &&
          semver.gte(connection.firmwareVersion, result.version)
        )
      ) {
        setShouldUpdateInstall(true);
        installUpdate();
        setStateWithResetError(DeviceUpdateState.Confirmation);
      } else {
        setShouldUpdateInstall(false);
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsUpdatesChecked(true);
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

  return {
    deviceUpdateState,
    downloadProgress,
    version,
    errorToShow,
    isUpdatesChecked,
    shouldUpdateInstall,
    onRetry,
  };
};
