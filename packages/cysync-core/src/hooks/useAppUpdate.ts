import { UpdateInfo } from '@cypherock/cysync-interfaces';
import { useCallback, useEffect, useState } from 'react';

import { autoUpdater } from '~/utils';
import logger from '~/utils/logger';

import { useStateWithRef } from './useStateWithRef';

export enum AppUpdateState {
  Checking,
  Confirmation,
  Downloading,
  Downloaded,
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
  const [error, setError] = useState<Error | undefined>();
  const [, setShouldInstallAfterUpdate, shouldInstallAfterUpdateRef] =
    useStateWithRef(false);

  const onError = (e: any) => {
    setTries(triesRef.current + 1);
    logger.error('App update error');
    logger.error(e);
    setError(e);

    if (triesRef.current > maxTries) {
      setAppUpdateState(AppUpdateState.FailedFallback);
    } else {
      setAppUpdateState(AppUpdateState.Failed);
    }
  };

  const downloadUpdate = async (installAfterUpdate = false) => {
    try {
      setShouldInstallAfterUpdate(installAfterUpdate);
      setInternalState(InternalAppUpdateState.Downloading);
      setDownloadProgress(0);
      setAppUpdateState(AppUpdateState.Downloading);
      await autoUpdater.downloadUpdate();
    } catch (e) {
      onError(e);
    }
  };

  const installUpdate = async () => {
    try {
      setInternalState(InternalAppUpdateState.Installing);
      await autoUpdater.installUpdate();
      setAppUpdateState(AppUpdateState.Successful);
    } catch (e) {
      onError(e);
    }
  };

  const installUpdateListener = async () => {
    // if auto-installation is disabled, don't trigger install; just change appUpdateState
    if (!shouldInstallAfterUpdateRef.current) {
      setAppUpdateState(AppUpdateState.Downloaded);
      return;
    }
    installUpdate();
  };

  const onRetry = () => {
    const retryFuncMap: Record<InternalAppUpdateState, () => Promise<void>> = {
      [InternalAppUpdateState.Checking]: checkForUpdates,
      [InternalAppUpdateState.Downloading]: downloadUpdate,
      [InternalAppUpdateState.Installing]: installUpdate,
    };

    retryFuncMap[internalState]();
  };

  const checkForUpdates = useCallback(async () => {
    try {
      setIsUpdatesChecked(false);
      setAppUpdateState(AppUpdateState.Checking);
      const result = await autoUpdater.checkForUpdates();
      setUpdateInfo(result);

      if (result) {
        setAppUpdateState(AppUpdateState.Confirmation);
      }
    } catch (e) {
      onError(e);
    } finally {
      setIsUpdatesChecked(true);
    }
  }, []);

  const addListeners = () => {
    autoUpdater.addUpdateErrorListener(onError);
    autoUpdater.addUpdateProgressListener(p => setDownloadProgress(p));
    autoUpdater.addUpdateCompletedListener(installUpdateListener);
  };

  useEffect(() => {
    addListeners();
    checkForUpdates();
  }, []);

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
    error,
  };
};
