import { autoUpdater } from 'electron-updater';
import { createServiceLogger } from './logger';

// TODO: Add updater triggered via UI
export const setupAutoUpdate = () => {
  autoUpdater.logger = createServiceLogger('autoUpdater');
  autoUpdater.checkForUpdatesAndNotify();
};
