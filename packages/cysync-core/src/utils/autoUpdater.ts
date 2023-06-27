import { AutoUpdater } from '@cypherock/cysync-interfaces';

const notImplementedFunction = () => {
  throw new Error('autoUpdater not implemented');
};

export const autoUpdater: AutoUpdater = {
  checkForUpdates: notImplementedFunction,
  downloadUpdate: notImplementedFunction,
  installUpdate: notImplementedFunction,
  addUpdateErrorListener: notImplementedFunction,
  addUpdateProgressListener: notImplementedFunction,
  addUpdateCompletedListener: notImplementedFunction,
  removeUpdateListeners: notImplementedFunction,
};

export const setAutoUpdater = (updater: AutoUpdater) => {
  for (const key in updater) {
    if ((updater as any)[key]) {
      (autoUpdater as any)[key] = (updater as any)[key];
    }
  }
};
