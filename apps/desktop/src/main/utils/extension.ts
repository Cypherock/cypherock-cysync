import fs from 'fs';
import path from 'path';

import { BrowserWindow } from 'electron';

import { config } from './config';
import { logger } from './logger';

/**
 * Issue with electron supporting the latest react dev tools
 *
 * Ref:
 * https://github.com/facebook/react/issues/25843
 * https://github.com/electron/electron/issues/36545
 */
async function manuallyInstallReactDevTools(win: BrowserWindow) {
  const unzipPath = path.join(
    config.USER_DATA_PATH,
    'extensions',
    'reactDevTools',
  );

  if (fs.existsSync(unzipPath)) {
    win.webContents.session.loadExtension(unzipPath);
  }
}

export const installDeveloperExtensions = async (win: BrowserWindow) => {
  try {
    if (config.IS_PRODUCTION) return;
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const devToolsInstaller = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [devToolsInstaller.REDUX_DEVTOOLS];

    await (devToolsInstaller.default as any)(extensions, forceDownload);
    await manuallyInstallReactDevTools(win);
  } catch (error: any) {
    logger.warn('An error occurred while installing extension', error);
  }
};
