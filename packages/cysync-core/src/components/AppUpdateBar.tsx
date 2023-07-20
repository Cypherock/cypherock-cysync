import { UpdateInfo } from '@cypherock/cysync-interfaces';
import {
  Check,
  CloudDownload,
  LangDisplay,
  UpdateBar,
  UpdateState,
} from '@cypherock/cysync-ui';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useTheme } from 'styled-components';

import { autoUpdater } from '~/utils';
import logger from '~/utils/logger';

import { selectLanguage, useAppSelector } from '..';

enum AppUpdateState {
  Checking,
  Confirmation,
  Downloading,
  Successful,
  Failed,
}

enum InternalAppUpdateState {
  Checking,
  Downloading,
  Installing,
}

type UpdateBarType = {
  [key in AppUpdateState]?: {
    icon: ReactNode;
    text: string;
    updateState: UpdateState;
    buttonText?: string;
    onButtonClick?: () => void;
  };
};

export const AppUpdateBar: FC = () => {
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = useState<AppUpdateState>(AppUpdateState.Checking);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | undefined>();
  const [downloadProgress, setDownloadProgress] = useState(57);
  const [internalState, setInternalState] = useState(
    InternalAppUpdateState.Checking,
  );

  const onError = (error: any) => {
    logger.error('App update error');
    logger.error(error);
    setState(AppUpdateState.Failed);
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

      if (result) setState(AppUpdateState.Confirmation);
    } catch (error) {
      onError(error);
    }
  };

  const addListeners = () => {
    autoUpdater.addUpdateErrorListener(onError);
    autoUpdater.addUpdateProgressListener(p => setDownloadProgress(p));
    autoUpdater.addUpdateCompletedListener(installUpdate);
  };

  const updateBarMap: UpdateBarType = {
    [AppUpdateState.Confirmation]: {
      icon: <CloudDownload />,
      text: 'confirmation',
      buttonText: 'download',
      updateState: 'normal',
      onButtonClick: downloadUpdate,
    },
    [AppUpdateState.Downloading]: {
      icon: <CloudDownload />,
      text: 'downloading',
      updateState: 'progress',
    },
    [AppUpdateState.Successful]: {
      icon: <Check />,
      text: 'successful',
      buttonText: 'installUpdate',
      updateState: 'success',
      onButtonClick: installUpdate,
    },
    [AppUpdateState.Failed]: {
      icon: <CloudDownload fill={theme?.palette.warn.main} />,
      text: 'error',
      buttonText: 'tryAgain',
      updateState: 'error',
      onButtonClick: onRetry,
    },
  };

  useEffect(() => {
    addListeners();
    checkForUpdates();
  }, []);

  return updateInfo ? (
    <UpdateBar
      progress={downloadProgress}
      icon={updateBarMap[state]?.icon}
      state={updateBarMap[state]?.updateState}
      onButtonClick={updateBarMap[state]?.onButtonClick}
      text={
        updateBarMap[state]?.text && (
          <LangDisplay
            text={
              (lang.strings.appUpdateBar as any)[
                updateBarMap[state]?.text ?? ''
              ]
            }
            variables={updateInfo}
          />
        )
      }
      buttonText={
        updateBarMap[state]?.buttonText && (
          <LangDisplay
            text={
              (lang.strings.appUpdateBar as any)[
                updateBarMap[state]?.buttonText ?? ''
              ]
            }
          />
        )
      }
    />
  ) : null;
};
