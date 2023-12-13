import { app, shell } from 'electron';

import { ipcConfig } from './helpers/config';

const closeApp = async () => {
  app.exit();
};

const focusApp = async () => {
  app.focus({
    steal: true,
  });
};

const openLink = async (link: string) => {
  shell.openExternal(link);
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
    name: ipcConfig.methods.openLink,
    func: openLink,
  },
];
