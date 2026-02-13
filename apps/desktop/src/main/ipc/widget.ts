import path from 'path';
import { app } from 'electron';

import { ipcConfig } from './helpers/config';

let currentWidgetAddress: string | null = null;

const getWidgetPreloadPath = async () => {
  if (!app.isPackaged) {
    return path.join(
      __dirname,
      '../../../../packages/cysync-core/src/pages/MainApp/StakingLending/preload/widget-preload.js',
    );
  }

  return path.join(process.resourcesPath, 'widget-preload.js');
};

const setWidgetAddress = async (address: string) => {
  currentWidgetAddress = address;
  return true;
};

export const getCurrentWidgetAddress = () => currentWidgetAddress;

export const getWidgetIPCHandlers = () => [
  {
    name: ipcConfig.methods.getWidgetPreloadPath,
    func: getWidgetPreloadPath,
  },
  {
    name: ipcConfig.methods.setWidgetAddress,
    func: setWidgetAddress,
  },
];
