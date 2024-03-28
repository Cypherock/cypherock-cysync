import {
  ConfirmationDialog,
  FirmwareDownloadGreenIcon,
  ProgressDialog,
} from '@cypherock/cysync-ui';
import React, { FC, ReactElement, useEffect, useRef } from 'react';

import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { routes } from '~/constants';
import { DeviceConnectionStatus, useDevice } from '~/context';
import { DeviceUpdateState, useDeviceUpdate, useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { getCloseAppMethod } from '~/utils';

import { DeviceUpdateLoading } from './DeviceUpdateLoading';

export const DeviceUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { deviceUpdate } = lang.strings.onboarding;

  const navigateTo = useNavigateTo();
  const { connection } = useDevice();

  const toNextPage = () => {
    navigateTo(routes.onboarding.deviceAuthentication.path);
  };

  const { state, downloadProgress, version, errorToShow, onRetry } =
    useDeviceUpdate();

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (state === DeviceUpdateState.Successful) {
      timeoutRef.current = setTimeout(toNextPage, 10000);
    }
    if (state === DeviceUpdateState.NotRequired) toNextPage();
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [state]);

  useEffect(() => {
    if (
      state === DeviceUpdateState.Successful &&
      connection?.status === DeviceConnectionStatus.CONNECTED
    ) {
      clearTimeout(timeoutRef.current);
      toNextPage();
    }
  }, [state, connection?.status]);

  const DeviceUpdateDialogs: Partial<Record<DeviceUpdateState, ReactElement>> =
    {
      [DeviceUpdateState.Checking]: (
        <DeviceUpdateLoading text={deviceUpdate.dialogs.checking.title} />
      ),
      [DeviceUpdateState.Confirmation]: (
        <ConfirmationDialog
          title={deviceUpdate.dialogs.confirmation.title}
          icon={<FirmwareDownloadGreenIcon />}
          subtext={deviceUpdate.dialogs.confirmation.subtext}
          textVariables={{ version }}
        />
      ),
      [DeviceUpdateState.Updating]: (
        <ProgressDialog
          title={deviceUpdate.dialogs.updating.heading}
          subtext={deviceUpdate.dialogs.updating.subtext}
          icon={<FirmwareDownloadGreenIcon />}
          progress={Number(downloadProgress.toFixed(0))}
          versionText={deviceUpdate.version}
          versionTextVariables={{ version }}
        />
      ),
      [DeviceUpdateState.Successful]: <LoaderDialog />,
    };

  return (
    <ErrorHandlerDialog
      error={errorToShow}
      noDelay
      defaultMsg={deviceUpdate.dialogs.updateFailed.subtext}
      onRetry={onRetry}
      textVariables={{ version }}
      isOnboarding
      onClose={getCloseAppMethod()}
    >
      {DeviceUpdateDialogs[state]}
    </ErrorHandlerDialog>
  );
};
