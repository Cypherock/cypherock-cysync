import { IDevice } from '@cypherock/sdk-interfaces';
import { contextBridge, ipcRenderer } from 'electron';
import { ipcConfig } from '../main/ipc/config';

const exportedFunctions = [
  {
    name: 'logWithServiceAndLevel',
    key: ipcConfig.logWithServiceAndLevel,
  },
  {
    name: 'getDevices',
    key: ipcConfig.getDevices,
  },
];

const createPreloadFunction =
  (key: string) =>
  async (...args: any[]) => {
    const { result, error } = await ipcRenderer.invoke(key, ...args);

    if (error) throw error;

    return result;
  };

const electronAPI = {
  connectDevice: async (device: IDevice) => {
    const { error } = await ipcRenderer.invoke(ipcConfig.connectDevice, device);
    if (error) throw error;

    const methods = [
      'getConnectionType',
      'isConnected',
      'beforeOperation',
      'afterOperation',
      'getSequenceNumber',
      'getNewSequenceNumber',
      'getDeviceState',
      'send',
      'receive',
      'peek',
      'destroy',
    ];

    const mockConnection = {};
    for (const method of methods) {
      (mockConnection as any)[method] = async (...args: any[]) =>
        createPreloadFunction(ipcConfig.connectedDeviceMethodCall)(
          device,
          method,
          ...args,
        );
    }

    return mockConnection;
  },
};

for (const func of exportedFunctions) {
  (electronAPI as any)[func.name] = createPreloadFunction(func.key);
}

const cysyncEnv = {
  LOG_LEVEL: process.env.LOG_LEVEL,
  BUILD_TYPE: process.env.BUILD_TYPE,
  API_CYPHEROCK: process.env.API_CYPHEROCK,
  BUILD_VERSION: process.env.BUILD_VERSION,
  IS_PRODUCTION: process.env.IS_PRODUCTION === 'true',
  IS_TEST: process.env.NODE_ENV?.toLowerCase() === 'test',
  ALLOW_PRERELEASE: process.env.ALLOW_PRERELEASE === 'true',
  USER_DATA_PATH: process.env.USER_DATA_PATH,
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('cysyncEnv', cysyncEnv);
