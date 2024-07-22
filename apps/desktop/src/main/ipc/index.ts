import { IpcMain, WebContents } from 'electron';

import { getAppIPCHandlers } from './app';
import { getAutoUpdateIPCHandlers } from './autoUpdater';
import { getDbIPCHandlers, removeDbListeners, setupDbListeners } from './db';
import {
  getDeviceIPCHandlers,
  removeDeviceListeners,
  setupDeviceListeners,
} from './device';
import { getLoggerIPCHandlers } from './logger';
import { getCySyncLogsIPCHandlers } from './logs';
import { getResetIPCHandlers } from './reset';
import { getSystemInfoIPCHandlers } from './systemInfo';
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
    ...getCySyncLogsIPCHandlers(),
    ...getSystemInfoIPCHandlers(),
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
  setupDeviceListeners(webContents);
};

export const removeListeners = () => {
  removeDbListeners();
  removeDeviceListeners();
};
