import { IpcMain } from 'electron';
import { logWithServiceAndLevel } from '../utils/logger';

export const setupLoggerIPC = (ipcMain: IpcMain) => {
  ipcMain.handle('logger:logWithServiceAndLevel', (_, ...args) => {
    logWithServiceAndLevel(args[0], args[1], args[2], args[3]);
  });
};
