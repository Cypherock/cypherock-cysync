import {
  ConfirmationDialog,
  DeviceUpdateIcon,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import { ManagerApp, UpdateFirmwareStatus } from '@cypherock/sdk-app-manager';
import React, { FC, ReactElement, useEffect, useRef } from 'react';
import semver from 'semver';

import { ErrorHandlerDialog } from '~/components';
import { IDeviceConnectionInfo, useDevice } from '~/context';
import { DeviceTask, useDeviceTask } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { getCloseAppMethod } from '~/utils';

import { DeviceUpdateLoading } from '~/pages/OnBoarding/DeviceUpdate/Dialogs/DeviceUpdateLoading';

enum DeviceUpdateState {
  Checking,
  Confirmation,
  Updating,
  Successful,
}

export enum InternalState {
  Checking,
  Installing,
}

export const DeviceUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);

  const { connection, connectDevice, getDevices } = useDevice();

  const [state, setState] = React.useState(DeviceUpdateState.Checking);
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const [internalState, setInternalState] = React.useState(
    InternalState.Checking,
  );
  const [version, setVersion] = React.useState<string | undefined>();
  const [errorToShow, setErrorToShow] = React.useState<Error | undefined>();

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

    await app.updateFirmware({
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

      const error = await task.run();
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
      });
      setVersion(result.version);

      if (
        connection?.firmwareVersion &&
        semver.gte(connection.firmwareVersion, result.version)
      ) {
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

  const DeviceUpdateDialogs: Record<DeviceUpdateState, ReactElement> = {
    [DeviceUpdateState.Checking]: (
      <DeviceUpdateLoading
        $isModal
        text={lang.strings.onboarding.deviceUpdate.dialogs.checking.title}
      />
    ),
    [DeviceUpdateState.Confirmation]: (
      <ConfirmationDialog
        $isModal
        title={lang.strings.onboarding.deviceUpdate.dialogs.confirmation.title}
        icon={<DeviceUpdateIcon />}
        subtext={
          lang.strings.onboarding.deviceUpdate.dialogs.confirmation.subtext
        }
        textVariables={{ version }}
      />
    ),
    [DeviceUpdateState.Updating]: (
      <ProgressDialog
        $isModal
        title={lang.strings.onboarding.deviceUpdate.dialogs.updating.heading}
        subtext={lang.strings.onboarding.deviceUpdate.dialogs.updating.subtext}
        icon={<DeviceUpdateIcon />}
        progress={Number(downloadProgress.toFixed(0))}
        versionTextVaribles={{ version }}
      />
    ),
    [DeviceUpdateState.Successful]: (
      <SuccessDialog
        $isModal
        title={
          lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful.heading
        }
        subtext={
          lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful.subtext
        }
        buttonText={lang.strings.buttons.continue}
      />
    ),
  };

  return (
    <ErrorHandlerDialog
      error={errorToShow}
      defaultMsg={
        lang.strings.onboarding.deviceUpdate.dialogs.updateFailed.subtext
      }
      onRetry={onRetry}
      textVariables={{ version }}
      isOnboarding
      onClose={getCloseAppMethod()}
    >
      {DeviceUpdateDialogs[state]}
    </ErrorHandlerDialog>
  );
};
