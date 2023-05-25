import { IDevice } from '@cypherock/sdk-interfaces';
import { contextBridge, ipcRenderer } from 'electron';
import { ipcConfig } from '../main/ipc/helpers/config';
import { createObjectProxy, createProxyFunction } from './utils';

const exportedFunctions = [
  {
    name: 'logWithServiceAndLevel',
    key: ipcConfig.methods.logWithServiceAndLevel,
  },
  {
    name: 'getDevices',
    key: ipcConfig.methods.getDevices,
  },
];

const electronAPI = {
  connectDevice: async (device: IDevice) => {
    const { error, result: methods } = await ipcRenderer.invoke(
      ipcConfig.methods.connectDevice,
      device,
    );

    if (error) throw error;

    return createObjectProxy({
      key: ipcConfig.methods.connectedDeviceMethodCall,
      methods,
      prefixArgs: [device],
    });
  },

  getDb: async () => {
    const { error, result: methods } = await ipcRenderer.invoke(
      ipcConfig.methods.dbMethodList,
    );

    if (error) throw error;

    return createObjectProxy({
      key: ipcConfig.methods.dbMethodCall,
      methods,
    });
  },
};

for (const func of exportedFunctions) {
  (electronAPI as any)[func.name] = createProxyFunction(func.key);
}

const cysyncEnv: any = {};
for (const env of ipcConfig.env) {
  cysyncEnv[env] = process.env[env];
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('cysyncEnv', cysyncEnv);
