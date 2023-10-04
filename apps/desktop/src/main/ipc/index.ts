import { IpcMain, WebContents } from 'electron';

import { getAppIPCHandlers } from './app';
import { getAutoUpdateIPCHandlers } from './autoUpdater';
import { getDbIPCHandlers, removeDbListeners, setupDbListeners } from './db';
import { getDeviceIPCHandlers } from './device';
import { getLoggerIPCHandlers } from './logger';
import { getResetIPCHandlers } from './reset';
import {
  getWalletConnectIPCHandlers,
  setupWalletConnectListeners,
} from './walletConnect';

export const setupIPCHandlers = (
  ipcMain: IpcMain,
  getWebContents: () => WebContents,
) => {
  const exportedFunctions = [
    ...getLoggerIPCHandlers(),
    ...getDeviceIPCHandlers(),
    ...getDbIPCHandlers(),
    ...getResetIPCHandlers(getWebContents),
    ...getAutoUpdateIPCHandlers(),
    ...getAppIPCHandlers(),
    ...getWalletConnectIPCHandlers(),
  ];

  for (const func of exportedFunctions) {
    ipcMain.handle(func.name, async (_, ...args) => {
      try {
        const result = await (func.func as any)(...args);
        return { result };
      } catch (error: any) {
        if (error.toJSON) {
          return { error: error.toJSON() };
        }

        return { error };
      }
    });
  }
};

export const setupListeners = (webContents: WebContents) => {
  setupDbListeners(webContents);
  setupWalletConnectListeners(webContents);
};

export const removeListeners = () => {
  removeDbListeners();
};
