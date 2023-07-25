import { app } from 'electron';

import { ipcConfig } from './helpers/config';

const closeApp = async () => {
  app.exit();
};

export const getCloseIPCHandlers = () => [
  {
    name: ipcConfig.methods.closeApp,
    func: closeApp,
  },
];
