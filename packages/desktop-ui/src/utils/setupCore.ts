import { setDB, updateLogger, setAutoUpdater } from '@cypherock/cysync-core';
import { createServiceLogger } from './logger';

export const setupCoreDependencies = async () => {
  updateLogger(createServiceLogger);
  setDB(await window.electronAPI.getDb());
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
