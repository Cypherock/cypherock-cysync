import { IpcMain, WebContents } from 'electron';
import { getLoggerIPCHandlers } from './logger';
import { getDeviceIPCHandlers } from './device';
import { getDbIPCHandlers } from './db';
import { getResetIPCHandlers } from './reset';
import { getAutoUpdateIPCHandlers } from './autoUpdater';

export const setupIPCHandlers = (
  ipcMain: IpcMain,
  webContents: WebContents,
) => {
  const exportedFunctions = [
    ...getLoggerIPCHandlers(),
    ...getDeviceIPCHandlers(),
    ...getDbIPCHandlers(),
    ...getResetIPCHandlers(webContents),
    ...getAutoUpdateIPCHandlers(),
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
