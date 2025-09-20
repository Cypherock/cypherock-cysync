import {
  BlurOverlay,
  ConfirmationDialog,
  FirmwareDownloadGreenIcon,
  ProgressDialog,
  parseLangTemplate,
} from '@cypherock/cysync-ui';
import { FirmwareVariant } from '@cypherock/sdk-app-manager';
import { createSelector } from '@reduxjs/toolkit';
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
  getFirmwareVariantDisplayName,
  selectLanguage,
  selectLastConnectedFirmware,
  useAppSelector,
  useDevice,
} from '..';

const selector = createSelector(
  [selectLanguage, selectLastConnectedFirmware],
  (lang, { isFirmwareBtcOnly }) => ({
    lang,
    isFirmwareBtcOnly,
  }),
);

export interface IDeviceUpdateDialogProps {
  forcedVariant?: FirmwareVariant;
}

export const DeviceUpdateDialog: FC<IDeviceUpdateDialogProps> = ({
  forcedVariant,
}) => {
  const { lang, isFirmwareBtcOnly } = useAppSelector(selector);
  const dispatch = useDispatch();
  const { deviceHandlingState, connection } = useDevice();
  const { deviceUpdate } = lang.strings.onboarding;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const existingVariant = isFirmwareBtcOnly
    ? FirmwareVariant.BTC_ONLY
    : FirmwareVariant.MULTI_COIN;
  const variant = forcedVariant ?? existingVariant;

  const variantDisplayName = getFirmwareVariantDisplayName(variant);

  const { state, downloadProgress, version, errorToShow, onRetry } =
    useDeviceUpdate(
      variant,
      forcedVariant === existingVariant ? undefined : forcedVariant,
    );

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
          { version, variant: variantDisplayName },
        ),
        successDescription: deviceUpdate.dialogs.updateSuccessful.subtext,
      }),
    );
  };

  useEffect(() => {
    if (state === DeviceUpdateState.Successful) {
      timeoutRef.current = setTimeout(() => {
        if (connection?.status === DeviceConnectionStatus.CONNECTED) {
          startAuthentication();
        }
      }, 10000);
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
          textVariables={{ version, variant: variantDisplayName }}
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
          versionTextVariables={{ version, variant: variantDisplayName }}
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
        textVariables={{ version, variant: variantDisplayName }}
        onClose={onClose}
        showCloseButton
      >
        {DeviceUpdateDialogs[state]}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};

DeviceUpdateDialog.defaultProps = {
  forcedVariant: undefined,
};
