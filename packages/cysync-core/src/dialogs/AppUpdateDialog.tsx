import {
  AppUpdateIcon,
  ConfirmationDialog,
  ErrorDialog,
  ProgressDialog,
  SuccessDialog,
  BlurOverlay,
} from '@cypherock/cysync-ui';
import React, { FC, ReactElement, useEffect } from 'react';

import { openDeviceUpdateDialog } from '~/actions';
import { AppUpdateState, InternalAppUpdateState, useAppUpdate } from '~/hooks';

import {
  AppUpdateFailedFallback,
  ErrorHandlerDialog,
  closeDialog,
  constants,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '..';

export const AppUpdateDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const {
    downloadUpdate,
    onRetry,
    updateInfo,
    downloadProgress,
    appUpdateState,
    isUpdatesChecked,
    error: errorToShow,
    internalState,
    checkForUpdates,
  } = useAppUpdate();

  const onClose = () => dispatch(closeDialog('appUpdateDialog'));
  const switchToDeviceUpdate = () => {
    onClose();
    dispatch(openDeviceUpdateDialog());
  };

  useEffect(() => {
    checkForUpdates();
  }, []);

  useEffect(() => {
    if (isUpdatesChecked && !updateInfo) {
      switchToDeviceUpdate();
    }
  }, [isUpdatesChecked, updateInfo]);

  const AppUpdateDialogs: Partial<Record<AppUpdateState, ReactElement>> = {
    [AppUpdateState.Confirmation]: (
      <ConfirmationDialog
        title={lang.strings.onboarding.appUpdate.dialogs.confirmation.title}
        subtext={lang.strings.onboarding.appUpdate.dialogs.confirmation.subtext}
        buttonText={lang.strings.buttons.update}
        textVariables={updateInfo}
        icon={<AppUpdateIcon />}
        handleClick={() => {
          downloadUpdate(true);
        }}
      />
    ),
    [AppUpdateState.Downloading]: (
      <ProgressDialog
        title={lang.strings.onboarding.appUpdate.dialogs.downloading.heading}
        subtext={lang.strings.onboarding.appUpdate.dialogs.downloading.subtext}
        versionText={
          lang.strings.onboarding.appUpdate.dialogs.downloading.version
        }
        versionTextVariables={updateInfo}
        icon={<AppUpdateIcon />}
        progress={downloadProgress}
      />
    ),
    [AppUpdateState.Successful]: (
      <SuccessDialog
        title={
          lang.strings.onboarding.appUpdate.dialogs.updateSuccessful.heading
        }
        subtext={
          lang.strings.onboarding.appUpdate.dialogs.updateSuccessful.subtext
        }
        alertText={
          lang.strings.onboarding.appUpdate.dialogs.updateSuccessful.bubbleText
        }
        onClose={switchToDeviceUpdate}
      />
    ),
    [AppUpdateState.Failed]: (
      <ErrorDialog
        title={
          internalState === InternalAppUpdateState.Checking
            ? lang.strings.onboarding.appUpdate.dialogs.checkingFailed.title
            : lang.strings.onboarding.appUpdate.dialogs.updateFailed.heading
        }
        subtext={
          internalState === InternalAppUpdateState.Checking
            ? lang.strings.onboarding.appUpdate.dialogs.checkingFailed.subtext
            : lang.strings.onboarding.appUpdate.dialogs.updateFailed.subtext
        }
        onPrimaryClick={onRetry}
        primaryActionText={lang.strings.buttons.retry}
        textVariables={updateInfo}
        onClose={switchToDeviceUpdate}
      />
    ),
    [AppUpdateState.FailedFallback]: (
      <AppUpdateFailedFallback
        title={
          lang.strings.onboarding.appUpdate.dialogs.updateFailedFallback.heading
        }
        subtext={
          lang.strings.onboarding.appUpdate.dialogs.updateFailedFallback.subtext
        }
        linkText={constants.appDownloadLink}
        alertText={
          lang.strings.onboarding.appUpdate.dialogs.updateFailedFallback
            .alertText
        }
        textVariables={updateInfo}
      />
    ),
  };

  if (appUpdateState === AppUpdateState.Checking) return null;

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        error={errorToShow}
        defaultMsg={
          lang.strings.onboarding.deviceUpdate.dialogs.updateFailed.subtext
        }
        onRetry={onRetry}
        onClose={switchToDeviceUpdate}
        showCloseButton
      >
        {AppUpdateDialogs[appUpdateState]}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};
