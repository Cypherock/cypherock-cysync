import React, { FC, ReactElement, useEffect } from 'react';
import {
  AppUpdateIcon,
  ConfirmationDialog,
  ErrorDialog,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import { UpdateInfo } from '@cypherock/cysync-interfaces';

import { autoUpdater } from '~/utils';
import { selectLanguage, useAppSelector } from '~/store';
import { useNavigateTo, useStateWithRef } from '~/hooks';
import { constants, routes } from '~/constants';
import logger from '~/utils/logger';
import { AppUpdateChecking } from './AppUpdateChecking';
import { AppUpdateFailedFallback } from './AppUpdateFailedFallback';

enum AppUpdateStates {
  Checking,
  Confirmation,
  Downloading,
  Successful,
  Failed,
  FailedFallback,
}

export enum UpdateState {
  Checking,
  Downloading,
  Installing,
}

export const AppUpdateDialogBox: FC = () => {
  const maxTries = 3;

  const lang = useAppSelector(selectLanguage);
  const navigate = useNavigateTo();

  const [state, setState] = React.useState(AppUpdateStates.Checking);
  const [, setTries, triesRef] = useStateWithRef(0);
  const [updateInfo, setUpdateInfo] = React.useState<UpdateInfo | undefined>();
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const [updateState, setUpdateState] = React.useState(UpdateState.Checking);

  const onError = (error: any) => {
    setTries(triesRef.current + 1);
    logger.error('App update error');
    logger.error(error);

    if (triesRef.current > maxTries) {
      setState(AppUpdateStates.FailedFallback);
    } else {
      setState(AppUpdateStates.Failed);
    }
  };

  const downloadUpdate = async () => {
    try {
      setUpdateState(UpdateState.Downloading);
      setDownloadProgress(0);
      setState(AppUpdateStates.Downloading);
      await autoUpdater.downloadUpdate();
    } catch (error) {
      onError(error);
    }
  };

  const installUpdate = async () => {
    try {
      setUpdateState(UpdateState.Installing);
      await autoUpdater.installUpdate();
      setState(AppUpdateStates.Successful);
    } catch (error) {
      onError(error);
    }
  };

  const onRetry = () => {
    const retryFuncMap: Record<UpdateState, () => Promise<void>> = {
      [UpdateState.Checking]: checkForUpdates,
      [UpdateState.Downloading]: downloadUpdate,
      [UpdateState.Installing]: installUpdate,
    };

    retryFuncMap[updateState]();
  };

  const checkForUpdates = async () => {
    try {
      setState(AppUpdateStates.Checking);
      const result = await autoUpdater.checkForUpdates();
      setUpdateInfo(result);

      if (!result) {
        navigate(routes.onboarding.deviceUpdate.path);
      } else {
        setState(AppUpdateStates.Confirmation);
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

  const AppUpdateDialogs: Record<AppUpdateStates, ReactElement> = {
    [AppUpdateStates.Checking]: (
      <AppUpdateChecking
        text={lang.strings.onboarding.appUpdate.dialogs.checking.title}
      />
    ),
    [AppUpdateStates.Confirmation]: (
      <ConfirmationDialog
        title={lang.strings.onboarding.appUpdate.dialogs.confirmation.title}
        subtext={lang.strings.onboarding.appUpdate.dialogs.confirmation.subtext}
        buttonText={lang.strings.buttons.update}
        textVariables={updateInfo}
        icon={<AppUpdateIcon />}
        handleClick={downloadUpdate}
      />
    ),
    [AppUpdateStates.Downloading]: (
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
    [AppUpdateStates.Successful]: (
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
    [AppUpdateStates.Failed]: (
      <ErrorDialog
        title={
          updateState === UpdateState.Checking
            ? lang.strings.onboarding.appUpdate.dialogs.checkingFailed.title
            : lang.strings.onboarding.appUpdate.dialogs.updateFailed.heading
        }
        subtext={
          updateState === UpdateState.Checking
            ? lang.strings.onboarding.appUpdate.dialogs.checkingFailed.subtext
            : lang.strings.onboarding.appUpdate.dialogs.updateFailed.subtext
        }
        onRetry={onRetry}
        showRetry
        textVariables={updateInfo}
      />
    ),
    [AppUpdateStates.FailedFallback]: (
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
