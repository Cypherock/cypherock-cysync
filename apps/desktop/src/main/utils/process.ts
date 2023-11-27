import { app, dialog } from 'electron';

import { beforeQuitHook } from './hooks';
import { logger } from './logger';

const handleUncaughtError = async (error: any, promise?: any) => {
  logger.error('Unhandled error on main process', { error, promise });
  logger.error(error);
  logger.error(promise);

  const title = 'Some error occurred, Contact cypherock for support.';
  let errorMsg = 'Unknown error';

  if (error) {
    if (error.message) {
      errorMsg = error.message;
    }

    if (error.stack) {
      errorMsg += `\n${error.stack}`;
    }
  }

  logger.error({ title, errorMsg });
  dialog.showErrorBox(title, errorMsg);

  await beforeQuitHook();
  app.exit(1);
};

export const setupProcessEventHandlers = () => {
  process.on('uncaughtException', handleUncaughtError);
  process.on('unhandledRejection', handleUncaughtError);
  process.on('SIGTERM', () => beforeQuitHook(app));
};
