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

export const getAppIPCHandlers = () => [
  {
    name: ipcConfig.methods.closeApp,
    func: closeApp,
  },
  {
    name: ipcConfig.methods.focusApp,
    func: focusApp,
  },
];
