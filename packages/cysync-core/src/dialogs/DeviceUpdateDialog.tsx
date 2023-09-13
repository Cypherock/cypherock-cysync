import {
  ConfirmationDialog,
  DeviceUpdateIcon,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import { BlurOverlay } from '@cypherock/cysync-ui/src';
import React, { FC, ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DeviceUpdateState, useDeviceUpdate } from '~/hooks';

import {
  ErrorHandlerDialog,
  closeDialog,
  selectLanguage,
  useAppSelector,
} from '..';

export const DeviceUpdateDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useDispatch();

  const { state, downloadProgress, version, errorToShow, onRetry, connection } =
    useDeviceUpdate();

  const onClose = () => dispatch(closeDialog('deviceUpdateDialog'));

  useEffect(() => {
    if (state === DeviceUpdateState.NotRequired) onClose();
  }, [state]);

  useEffect(() => {
    if (!connection) onClose();
  }, [connection]);

  const DeviceUpdateDialogs: Partial<Record<DeviceUpdateState, ReactElement>> =
    {
      [DeviceUpdateState.Confirmation]: (
        <ConfirmationDialog
          title={
            lang.strings.onboarding.deviceUpdate.dialogs.confirmation.title
          }
          icon={<DeviceUpdateIcon />}
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
          icon={<DeviceUpdateIcon />}
          progress={Number(downloadProgress.toFixed(0))}
          versionTextVariables={{ version }}
        />
      ),
      [DeviceUpdateState.Successful]: (
        <SuccessDialog
          title={
            lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful
              .heading
          }
          subtext={
            lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful
              .subtext
          }
          buttonText={lang.strings.buttons.continue}
          handleClick={onClose}
        />
      ),
    };

  if (state === DeviceUpdateState.Checking) return null;

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        error={errorToShow}
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
