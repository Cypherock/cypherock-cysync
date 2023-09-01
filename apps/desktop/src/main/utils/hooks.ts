import * as deviceUtils from './device';
import { logger } from './logger';

let isBeforeQuitActionDone = false;

export const beforeQuitHook = async (
  app?: Electron.App,
  e?: Electron.Event,
  quit = true,
) => {
  if (!isBeforeQuitActionDone) {
    logger.info('Before quit hook triggered');

    if (e) e.preventDefault();

    await deviceUtils.abortAndRemoveConnectedDevice();

    logger.info('Before quit hook completed');
    isBeforeQuitActionDone = true;

    if (app && quit) app.exit();
  }
};
