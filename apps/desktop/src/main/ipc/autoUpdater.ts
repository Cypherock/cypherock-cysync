import { ipcConfig } from './helpers/config';

import { autoUpdater } from '../utils/autoUpdater';

const checkForUpdates = async () => autoUpdater.checkForUpdates();

const downloadUpdate = async () => autoUpdater.downloadUpdate();

const installUpdate = async () => autoUpdater.installUpdate();

export const getAutoUpdateIPCHandlers = () => [
  {
    name: ipcConfig.methods.checkForUpdates,
    func: checkForUpdates,
  },
  {
    name: ipcConfig.methods.downloadUpdate,
    func: downloadUpdate,
  },
  {
    name: ipcConfig.methods.installUpdates,
    func: installUpdate,
  },
];
