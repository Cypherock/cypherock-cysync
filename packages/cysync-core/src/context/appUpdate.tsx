import { UpdateInfo } from '@cypherock/cysync-interfaces';
import React, { useEffect, useMemo } from 'react';

import { AppUpdateState, InternalAppUpdateState, useAppUpdate } from '~/hooks';

export interface AppUpdateContextInterface {
  updateInfo: UpdateInfo | undefined;
  downloadProgress: number;
  internalState: InternalAppUpdateState;
  appUpdateState: AppUpdateState;
  isUpdatesChecked: boolean;
  downloadUpdate: (installAfterUpdate?: boolean) => void;
  installUpdate: () => void;
  checkForUpdates: () => void;
  onRetry: () => void;
  onError: (error: any) => void;
  error: Error | undefined;
}

export const AppUpdateContext: React.Context<AppUpdateContextInterface> =
  React.createContext<AppUpdateContextInterface>(
    {} as AppUpdateContextInterface,
  );

export interface AppUpdateProviderProps {
  children: React.ReactNode;
}

export const AppUpdateProvider: React.FC<AppUpdateProviderProps> = ({
  children,
}) => {
  const {
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
  } = useAppUpdate();
  const ctx = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  useEffect(() => {
    const minutes = 15;
    const checkUpdateInterval = setInterval(
      checkForUpdates,
      minutes * 60 * 1000,
    );
    return () => clearInterval(checkUpdateInterval);
  }, [checkForUpdates]);

  return (
    <AppUpdateContext.Provider value={ctx}>
      {children}
    </AppUpdateContext.Provider>
  );
};

export function useAppUpdateContext(): AppUpdateContextInterface {
  return React.useContext(AppUpdateContext);
}
