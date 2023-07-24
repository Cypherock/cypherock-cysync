import {
  setDB,
  setKeyDB,
  updateLogger,
  setResetCySyncMethod,
  setCloseAppMethod,
  setAutoUpdater,
} from '@cypherock/cysync-core';

import { createServiceLogger } from './logger';

export const setupCoreDependencies = async () => {
  updateLogger(createServiceLogger);
  setDB(await window.electronAPI.getDb());
  setKeyDB(await window.electronAPI.getKeyDb());
  setResetCySyncMethod(window.electronAPI.resetCySync);
  setCloseAppMethod(window.electronAPI.closeApp);
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
};
