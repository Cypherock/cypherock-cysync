import { closeDbConnection } from './db';
import * as deviceUtils from './device';
import { logger } from './logger';

let isBeforeQuitActionDone = false;

export const beforeQuitHook = async (
  app?: Electron.App,
  e?: Electron.Event,
) => {
  if (!isBeforeQuitActionDone) {
    logger.info('Before quit hook triggred');

    if (e) e.preventDefault();

    await closeDbConnection();
    await deviceUtils.abortAndRemoveConnectedDevice();

    logger.info('Before quit hook completed');
    isBeforeQuitActionDone = true;

    if (app) app.exit();
  }
};

export const addAppHooks = (app: Electron.App) => {
  app.on('before-quit', e => beforeQuitHook(app, e));
};
