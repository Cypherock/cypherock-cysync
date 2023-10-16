import {
  setDB,
  setKeyDB,
  updateLogger,
  setResetCySyncMethod,
  setCloseAppMethod,
  setAutoUpdater,
  setDependencies,
  setInitWCUriMethod,
  setFocusAppMethod,
  setCySyncLogsMethod,
} from '@cypherock/cysync-core';
import {
  setAddExternalLinkListenerMethod,
  setRemoveExternalLinkListenerMethod,
} from '@cypherock/cysync-core/dist/esm/utils';

import { createServiceLogger } from './logger';

export const setupCoreDependencies = async () => {
  setDependencies();
  updateLogger(createServiceLogger);
  setDB(await window.electronAPI.getDb());
  setKeyDB(await window.electronAPI.getKeyDb());
  setResetCySyncMethod(window.electronAPI.resetCySync);
  setCySyncLogsMethod(window.electronAPI.getCySyncLogs);
  setCloseAppMethod(window.electronAPI.closeApp);
  setFocusAppMethod(window.electronAPI.focusApp);
  setAutoUpdater({
    checkForUpdates: window.electronAPI.checkForUpdates,
    downloadUpdate: window.electronAPI.downloadUpdate,
    installUpdate: window.electronAPI.installUpdate,
    addUpdateProgressListener:
      window.electronAPI.addUpdateDownloadProgressListener,
    addUpdateCompletedListener:
      window.electronAPI.addUpdateDownloadCompletedListener,
    addUpdateErrorListener: window.electronAPI.addUpdateDownloadErrorListener,
    removeUpdateListeners: window.electronAPI.removeUpdateDownloadListeners,
  });
  setInitWCUriMethod(window.electronAPI.initWCUri);
  setAddExternalLinkListenerMethod(window.electronAPI.addExternalLinkListener);
  setRemoveExternalLinkListenerMethod(
    window.electronAPI.removeExternalLinkListener,
  );
};
