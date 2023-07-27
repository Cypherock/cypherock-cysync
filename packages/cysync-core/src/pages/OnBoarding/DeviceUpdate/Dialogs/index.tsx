import {
  ConfirmationDialog,
  DeviceUpdateIcon,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, ReactElement } from 'react';

import { ErrorHandlerDialog } from '~/components';
import { routes } from '~/constants';
import { DeviceUpdateState, useDeviceUpdate, useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';
import { getCloseAppMethod } from '~/utils';

import { DeviceUpdateLoading } from './DeviceUpdateLoading';

export const DeviceUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const {
    version,
    deviceUpdateState,
    downloadProgress,
    errorToShow,
    shouldUpdateInstall,
    isUpdatesChecked,
    onRetry,
  } = useDeviceUpdate();

  const toNextPage = () => {
    navigateTo(routes.onboarding.deviceAuthentication.path);
  };

  useEffect(() => {
    if (!shouldUpdateInstall && isUpdatesChecked) {
      toNextPage();
    }
  }, [shouldUpdateInstall, isUpdatesChecked]);

  const DeviceUpdateDialogs: Record<DeviceUpdateState, ReactElement> = {
    [DeviceUpdateState.Checking]: (
      <DeviceUpdateLoading
        text={lang.strings.onboarding.deviceUpdate.dialogs.checking.title}
      />
    ),
    [DeviceUpdateState.Confirmation]: (
      <ConfirmationDialog
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
        title={lang.strings.onboarding.deviceUpdate.dialogs.updating.heading}
        subtext={lang.strings.onboarding.deviceUpdate.dialogs.updating.subtext}
        icon={<DeviceUpdateIcon />}
        progress={Number(downloadProgress.toFixed(0))}
        versionTextVaribles={{ version }}
      />
    ),
    [DeviceUpdateState.Successful]: (
      <SuccessDialog
        title={
          lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful.heading
        }
        subtext={
          lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful.subtext
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
      {DeviceUpdateDialogs[deviceUpdateState]}
    </ErrorHandlerDialog>
  );
};
