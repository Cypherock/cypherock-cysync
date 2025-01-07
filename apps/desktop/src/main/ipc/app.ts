import { app } from 'electron';

import { ipcConfig } from './helpers/config';

const closeApp = async () => {
  app.exit();
};

const focusApp = async () => {
  app.focus({
    steal: true,
  });
};

const restartApp = async () => {
  app.relaunch();
  app.quit();
};

export const getAppIPCHandlers = () => [
  {
    name: ipcConfig.methods.closeApp,
    func: closeApp,
  },
  {
    name: ipcConfig.methods.focusApp,
    func: focusApp,
  },
  {
    name: ipcConfig.methods.restartApp,
    func: restartApp,
  },
];
