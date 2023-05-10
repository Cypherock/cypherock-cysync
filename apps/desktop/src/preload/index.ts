import { IElectronAPI } from '@cypherock/cysync-interfaces';
import { contextBridge, ipcRenderer } from 'electron';

const electronAPI: IElectronAPI = {
  logWithServiceAndLevel: (...args: any[]) =>
    ipcRenderer.invoke('logger:logWithServiceAndLevel', ...args),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
