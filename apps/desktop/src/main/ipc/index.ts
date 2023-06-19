import { IpcMain } from 'electron';
import { getLoggerIPCHandlers } from './logger';
import { getDeviceIPCHandlers } from './device';
import { getDbIPCHandlers } from './db';
import { getAutoUpdateIPCHandlers } from './autoUpdater';

export const setupIPCHandlers = (ipcMain: IpcMain) => {
  const exportedFunctions = [
    ...getLoggerIPCHandlers(),
    ...getDeviceIPCHandlers(),
    ...getDbIPCHandlers(),
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
