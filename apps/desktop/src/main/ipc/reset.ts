import { app, WebContents } from 'electron';

import { ipcConfig } from './helpers/config';

import { clearDatabase, logger } from '../utils';

const createResetCySyncMethod = (webContents: WebContents) => async () => {
  logger.info('Resetting CySync');

  await clearDatabase();
  await webContents.session.clearCache();
  await webContents.session.clearStorageData();
  app.relaunch();
  app.exit();
};

export const getResetIPCHandlers = (webContents: WebContents) => [
  {
    name: ipcConfig.methods.resetCySync,
    func: createResetCySyncMethod(webContents),
  },
];
