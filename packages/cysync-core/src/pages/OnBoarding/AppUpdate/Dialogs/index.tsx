import {
  AppUpdateIcon,
  ConfirmationDialog,
  ErrorDialog,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import React, { FC, ReactElement, useEffect } from 'react';

import { constants, routes } from '~/constants';
import {
  AppUpdateState,
  InternalAppUpdateState,
  useAppUpdate,
  useNavigateTo,
} from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { AppUpdateChecking } from './AppUpdateChecking';
import { AppUpdateFailedFallback } from './AppUpdateFailedFallback';

export const AppUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const {
    downloadUpdate,
    onRetry,
    updateInfo,
    internalState,
    downloadProgress,
    appUpdateState,
    isUpdatesChecked,
  } = useAppUpdate({ shouldInstallAfterUpdate: true });

  useEffect(() => {
    if (isUpdatesChecked && !updateInfo) {
      navigateTo(routes.onboarding.deviceUpdate.path);
    }
  }, [isUpdatesChecked, updateInfo]);

  const AppUpdateDialogs: Record<AppUpdateState, ReactElement> = {
    [AppUpdateState.Checking]: (
      <AppUpdateChecking
        text={lang.strings.onboarding.appUpdate.dialogs.checking.title}
      />
    ),
    [AppUpdateState.Confirmation]: (
      <ConfirmationDialog
        title={lang.strings.onboarding.appUpdate.dialogs.confirmation.title}
        subtext={lang.strings.onboarding.appUpdate.dialogs.confirmation.subtext}
        buttonText={lang.strings.buttons.update}
        textVariables={updateInfo}
        icon={<AppUpdateIcon />}
        handleClick={downloadUpdate}
      />
    ),
    [AppUpdateState.Downloading]: (
      <ProgressDialog
        title={lang.strings.onboarding.appUpdate.dialogs.downloading.heading}
        subtext={lang.strings.onboarding.appUpdate.dialogs.downloading.subtext}
        versionText={
          lang.strings.onboarding.appUpdate.dialogs.downloading.version
        }
        versionTextVaribles={updateInfo}
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

  return AppUpdateDialogs[appUpdateState];
};
