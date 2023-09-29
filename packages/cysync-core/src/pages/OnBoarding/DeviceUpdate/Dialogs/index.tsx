import {
  ConfirmationDialog,
  DeviceUpdateIcon,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, ReactElement } from 'react';

import { ErrorHandlerDialog } from '~/components';
import { routes } from '~/constants';
import { useNavigateTo, useDeviceUpdate, DeviceUpdateState } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';
import { getCloseAppMethod } from '~/utils';

import { DeviceUpdateLoading } from './DeviceUpdateLoading';
import { DeviceHandlingState, useDevice } from '~/context';

export const DeviceUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);

  const navigateTo = useNavigateTo();

  const toNextPage = () => {
    navigateTo(routes.onboarding.deviceAuthentication.path);
  };

  const { state, downloadProgress, version, errorToShow, onRetry } =
    useDeviceUpdate();

  const { deviceHandlingState } = useDevice();

  useEffect(() => {
    if (state === DeviceUpdateState.NotRequired) {
      toNextPage();
    }
  }, [state]);

  const DeviceUpdateDialogs: Partial<Record<DeviceUpdateState, ReactElement>> =
    {
      [DeviceUpdateState.Checking]: (
        <DeviceUpdateLoading
          text={lang.strings.onboarding.deviceUpdate.dialogs.checking.title}
        />
      ),
      [DeviceUpdateState.Confirmation]:
        deviceHandlingState === DeviceHandlingState.BOOTLOADER ? (
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
        ) : (
          <DeviceUpdateLoading
            text={lang.strings.onboarding.deviceUpdate.dialogs.checking.title}
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
          handleClick={toNextPage}
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
