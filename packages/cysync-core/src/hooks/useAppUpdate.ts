import { UpdateInfo } from '@cypherock/cysync-interfaces';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { autoUpdater } from '~/utils';
import logger from '~/utils/logger';

import { useStateWithRef } from './useStateWithRef';

import { routes } from '..';

export enum AppUpdateState {
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

export const useAppUpdate = () => {
  const maxTries = 3;

  const location = useLocation();
  const [appUpdateState, setAppUpdateState] = useState<AppUpdateState>(
    AppUpdateState.Checking,
  );
  const [, setTries, triesRef] = useStateWithRef(0);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | undefined>();
  const [isUpdatesChecked, setIsUpdatesChecked] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [internalState, setInternalState] = useState<InternalAppUpdateState>(
    InternalAppUpdateState.Checking,
  );

  const onError = (error: any) => {
    setTries(triesRef.current + 1);
    logger.error('App update error');
    logger.error(error);

    if (triesRef.current > maxTries) {
      setAppUpdateState(AppUpdateState.FailedFallback);
    } else {
      setAppUpdateState(AppUpdateState.Failed);
    }
  };

  const downloadUpdate = async () => {
    try {
      setInternalState(InternalAppUpdateState.Downloading);
      setDownloadProgress(0);
      setAppUpdateState(AppUpdateState.Downloading);
      await autoUpdater.downloadUpdate();
    } catch (error) {
      onError(error);
    }
  };

  const installUpdateHandler = async () => {
    try {
      setInternalState(InternalAppUpdateState.Installing);
      await autoUpdater.installUpdate();
      setAppUpdateState(AppUpdateState.Successful);
    } catch (error) {
      onError(error);
    }
  };

  const addInstallUpdateListener = () => {
    autoUpdater.addUpdateCompletedListener(installUpdate);
  };

  const installUpdate = async () => {
    try {
      if (routes.onboarding.appUpdate.path !== location.pathname)
        addInstallUpdateListener();
      await installUpdateHandler();
    } catch (error) {
      onError(error);
    }
  };

  const onRetry = () => {
    const retryFuncMap: Record<InternalAppUpdateState, () => Promise<void>> = {
      [InternalAppUpdateState.Checking]: checkForUpdates,
      [InternalAppUpdateState.Downloading]: downloadUpdate,
      [InternalAppUpdateState.Installing]: installUpdateHandler,
    };

    retryFuncMap[internalState]();
  };

  const checkForUpdates = async () => {
    try {
      setIsUpdatesChecked(false);
      setAppUpdateState(AppUpdateState.Checking);
      const result = await autoUpdater.checkForUpdates();
      setUpdateInfo(result);

      if (result) {
        setAppUpdateState(AppUpdateState.Confirmation);
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsUpdatesChecked(true);
    }
  };

  const addListeners = () => {
    autoUpdater.addUpdateErrorListener(onError);
    autoUpdater.addUpdateProgressListener(p => setDownloadProgress(p));
    if (routes.onboarding.appUpdate.path === location.pathname)
      addInstallUpdateListener();
  };

  useEffect(() => {
    addListeners();
    checkForUpdates();
  }, [routes, location.pathname]);

  return {
    updateInfo,
    downloadProgress,
    internalState,
    appUpdateState,
    isUpdatesChecked,
    downloadUpdate,
    installUpdate,
    checkForUpdates,
    onRetry,
    onError,
  };
};
