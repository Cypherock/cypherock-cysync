import {
  BlurOverlay,
  ConfirmationDialog,
  FirmwareDownloadGreenIcon,
  ProgressDialog,
  parseLangTemplate,
} from '@cypherock/cysync-ui';
import React, { FC, ReactElement, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { openDeviceAuthenticationDialog } from '~/actions';
import { DeviceUpdateState, useDeviceUpdate } from '~/hooks';

import {
  DeviceConnectionStatus,
  DeviceHandlingState,
  ErrorHandlerDialog,
  LoaderDialog,
  closeDialog,
  selectLanguage,
  useAppSelector,
  useDevice,
} from '..';

export const DeviceUpdateDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useDispatch();
  const { deviceHandlingState, connection } = useDevice();
  const { deviceUpdate } = lang.strings.onboarding;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const { state, downloadProgress, version, errorToShow, onRetry } =
    useDeviceUpdate();

  const onClose = () => {
    if (
      deviceHandlingState === DeviceHandlingState.BOOTLOADER &&
      ![DeviceUpdateState.Successful, DeviceUpdateState.NotRequired].includes(
        state,
      )
    ) {
      // retry if closed from error; i.e., device is in bootloader & state is not Successful
      onRetry();
    } else {
      // close if device not-in-bootloader or success
      dispatch(closeDialog('deviceUpdateDialog'));
    }
  };

  const startAuthentication = () => {
    onClose();
    dispatch(
      openDeviceAuthenticationDialog({
        successTitle: parseLangTemplate(
          deviceUpdate.dialogs.updateSuccessful.headingWithVersion,
          { version },
        ),
        successDescription: deviceUpdate.dialogs.updateSuccessful.subtext,
      }),
    );
  };

  useEffect(() => {
    if (state === DeviceUpdateState.Successful) {
      timeoutRef.current = setTimeout(startAuthentication, 10000);
    }
    if (state === DeviceUpdateState.NotRequired) onClose();
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
      startAuthentication();
    }
  }, [state, connection?.status]);

  const DeviceUpdateDialogs: Partial<Record<DeviceUpdateState, ReactElement>> =
    {
      [DeviceUpdateState.Confirmation]: (
        <ConfirmationDialog
          title={deviceUpdate.dialogs.confirmation.title}
          icon={<FirmwareDownloadGreenIcon />}
          subtext={deviceUpdate.dialogs.confirmation.subtext}
          textVariables={{ version }}
          onClose={onClose}
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

  if (state === DeviceUpdateState.Checking) return null;

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        error={errorToShow}
        noDelay
        defaultMsg={deviceUpdate.dialogs.updateFailed.subtext}
        onRetry={onRetry}
        textVariables={{ version }}
        onClose={onClose}
        showCloseButton
      >
        {DeviceUpdateDialogs[state]}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};
