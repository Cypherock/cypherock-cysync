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

    const options: Electron.RelaunchOptions = { args: process.argv };
    if (process.env.APPIMAGE) {
      options.execPath = process.env.APPIMAGE;
      options.args = options.args ?? [];
      options.args.unshift('--appimage-extract-and-run');
    }

    app.relaunch(options);
    app.quit();
  };

export const getResetIPCHandlers = (getWebContents: () => WebContents) => [
  {
    name: ipcConfig.methods.resetCySync,
    func: createResetCySyncMethod(getWebContents),
  },
];
