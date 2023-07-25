import { UpdateInfo } from '@cypherock/cysync-interfaces';
import {
  AppUpdateIcon,
  ConfirmationDialog,
  ErrorDialog,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import React, { FC, ReactElement, useEffect } from 'react';

import { constants, routes } from '~/constants';
import { useNavigateTo, useStateWithRef } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { autoUpdater } from '~/utils';
import logger from '~/utils/logger';

import { AppUpdateChecking } from './AppUpdateChecking';
import { AppUpdateFailedFallback } from './AppUpdateFailedFallback';

enum AppUpdateState {
  Checking,
  Confirmation,
  Downloading,
  Successful,
  Failed,
  FailedFallback,
}

export enum InternalAppUpdateState {
  Checking,
  Downloading,
  Installing,
}

export const AppUpdateDialogBox: FC = () => {
  const maxTries = 3;

  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const [state, setState] = React.useState(AppUpdateState.Checking);
  const [, setTries, triesRef] = useStateWithRef(0);
  const [updateInfo, setUpdateInfo] = React.useState<UpdateInfo | undefined>();
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const [internalState, setInternalState] = React.useState(
    InternalAppUpdateState.Checking,
  );

  const onError = (error: any) => {
    setTries(triesRef.current + 1);
    logger.error('App update error');
    logger.error(error);

    if (triesRef.current > maxTries) {
      setState(AppUpdateState.FailedFallback);
    } else {
      setState(AppUpdateState.Failed);
    }
  };

  const downloadUpdate = async () => {
    try {
      setInternalState(InternalAppUpdateState.Downloading);
      setDownloadProgress(0);
      setState(AppUpdateState.Downloading);
      await autoUpdater.downloadUpdate();
    } catch (error) {
      onError(error);
    }
  };

  const installUpdate = async () => {
    try {
      setInternalState(InternalAppUpdateState.Installing);
      await autoUpdater.installUpdate();
      setState(AppUpdateState.Successful);
    } catch (error) {
      onError(error);
    }
  };

  const onRetry = () => {
    const retryFuncMap: Record<InternalAppUpdateState, () => Promise<void>> = {
      [InternalAppUpdateState.Checking]: checkForUpdates,
      [InternalAppUpdateState.Downloading]: downloadUpdate,
      [InternalAppUpdateState.Installing]: installUpdate,
    };

    retryFuncMap[internalState]();
  };

  const checkForUpdates = async () => {
    try {
      setState(AppUpdateState.Checking);
      const result = await autoUpdater.checkForUpdates();
      setUpdateInfo(result);

      if (!result) {
        navigateTo(routes.onboarding.deviceUpdate.path);
      } else {
        setState(AppUpdateState.Confirmation);
      }
    } catch (error) {
      onError(error);
    }
  };

  const addListeners = () => {
    autoUpdater.addUpdateErrorListener(onError);
    autoUpdater.addUpdateProgressListener(p => setDownloadProgress(p));
    autoUpdater.addUpdateCompletedListener(installUpdate);
  };

  useEffect(() => {
    addListeners();
    checkForUpdates();
  }, []);

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

  return AppUpdateDialogs[state];
};
