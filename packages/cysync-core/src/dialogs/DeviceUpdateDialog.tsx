import {
  ConfirmationDialog,
  FirmwareDownloadGreenIcon,
  ProgressDialog,
  BlurOverlay,
} from '@cypherock/cysync-ui';
import React, { FC, ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DeviceUpdateState, useDeviceUpdate } from '~/hooks';

import {
  DeviceHandlingState,
  ErrorHandlerDialog,
  closeDialog,
  selectLanguage,
  useAppSelector,
  useDevice,
} from '..';

export const DeviceUpdateDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useDispatch();
  const { deviceHandlingState } = useDevice();

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

  useEffect(() => {
    if (state === DeviceUpdateState.Successful) onClose();
    if (state === DeviceUpdateState.NotRequired) onClose();
  }, [state]);

  const DeviceUpdateDialogs: Partial<Record<DeviceUpdateState, ReactElement>> =
    {
      [DeviceUpdateState.Confirmation]: (
        <ConfirmationDialog
          title={
            lang.strings.onboarding.deviceUpdate.dialogs.confirmation.title
          }
          icon={<FirmwareDownloadGreenIcon />}
          subtext={
            lang.strings.onboarding.deviceUpdate.dialogs.confirmation.subtext
          }
          textVariables={{ version }}
        />
      ),
      [DeviceUpdateState.Updating]: (
        <ProgressDialog
          title={lang.strings.onboarding.deviceUpdate.dialogs.updating.heading}
          subtext={
            lang.strings.onboarding.deviceUpdate.dialogs.updating.subtext
          }
          icon={<FirmwareDownloadGreenIcon />}
          progress={Number(downloadProgress.toFixed(0))}
          versionTextVariables={{ version }}
        />
      ),
    };

  if (state === DeviceUpdateState.Checking) return null;

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        error={errorToShow}
        noDelay
        defaultMsg={
          lang.strings.onboarding.deviceUpdate.dialogs.updateFailed.subtext
        }
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
