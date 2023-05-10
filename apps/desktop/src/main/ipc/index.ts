import { IpcMain } from 'electron';
import { setupLoggerIPC } from './logger';

export const setupIPC = (ipcMain: IpcMain) => {
  setupLoggerIPC(ipcMain);
};
