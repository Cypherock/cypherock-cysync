import { app, WebContents } from 'electron';

import { ipcConfig } from './helpers/config';

import { clearDatabase, logger } from '../utils';

const createResetCySyncMethod =
  (getWebContents: () => WebContents) => async () => {
    logger.info('Resetting CySync');
    const webContents = getWebContents();
    await clearDatabase();
    await webContents.session.clearCache();
    await webContents.session.clearStorageData();
    app.relaunch();
    app.exit();
  };

export const getResetIPCHandlers = (getWebContents: () => WebContents) => [
  {
    name: ipcConfig.methods.resetCySync,
    func: createResetCySyncMethod(getWebContents),
  },
];
