import { IpcMain } from 'electron';
import { getLoggerIPCHandlers } from './logger';
import { getDeviceIPCHandlers } from './device';

export const setupIPCHandlers = (ipcMain: IpcMain) => {
  const exportedFunctions = [
    ...getLoggerIPCHandlers(),
    ...getDeviceIPCHandlers(),
  ];

  for (const func of exportedFunctions) {
    ipcMain.handle(func.name, async (_, ...args) => {
      try {
        const result = await (func.func as any)(...args);
        return { result };
      } catch (error) {
        return { error };
      }
    });
  }
};
