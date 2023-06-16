import { IDevice } from '@cypherock/sdk-interfaces';
import { contextBridge, ipcRenderer } from 'electron';
import { ipcConfig } from '../main/ipc/helpers/config';
import {
  createObjectProxy,
  createProxyFunction,
  createProxyListener,
} from './utils';

const exportedFunctions = [
  {
    name: 'logWithServiceAndLevel',
    key: ipcConfig.methods.logWithServiceAndLevel,
  },
  {
    name: 'getDevices',
    key: ipcConfig.methods.getDevices,
  },
  {
    name: 'resetCySync',
    key: ipcConfig.methods.resetCySync,
  },
  {
    name: 'checkForUpdates',
    key: ipcConfig.methods.checkForUpdates,
  },
  {
    name: 'downloadUpdate',
    key: ipcConfig.methods.downloadUpdate,
  },
  {
    name: 'installUpdate',
    key: ipcConfig.methods.installUpdates,
  },
];

const exportedListeners = [
  {
    name: 'addUpdateDownloadProgressListener',
    key: ipcConfig.listeners.downloadUpdateProgress,
  },
  {
    name: 'addUpdateDownloadCompletedListener',
    key: ipcConfig.listeners.downloadUpdateCompleted,
  },
  {
    name: 'addUpdateDownloadErrorListener',
    key: ipcConfig.listeners.downloadUpdateError,
  },
  {
    name: 'removeUpdateDownloadListeners',
    remove: [
      ipcConfig.listeners.downloadUpdateCompleted,
      ipcConfig.listeners.downloadUpdateProgress,
      ipcConfig.listeners.downloadUpdateError,
    ],
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

    const db = createObjectProxy({
      key: ipcConfig.methods.dbMethodCall,
      methods,
    });

    const collectionNameList = [
      'account',
      'wallet',
      'transaction',
      'device',
      'priceHistory',
      'priceInfo',
    ];

    const eventNames = ['change'];

    for (const collectionName of collectionNameList) {
      const collection = db[collectionName];
      if (!collection) {
        // eslint-disable-next-line no-continue
        continue;
      }

      collection.addListener = (event: string, listener: any) => {
        createProxyListener({
          key: `${ipcConfig.listeners.dbListenerPrefix}:${collectionName}:${event}`,
        })(listener);
      };

      // eslint-disable-next-line no-loop-func
      collection.removeAllListener = (event?: string) => {
        let removeListeners: string[];

        if (event) {
          removeListeners = [
            `${ipcConfig.listeners.dbListenerPrefix}:${collectionName}:${event}`,
          ];
        } else {
          removeListeners = eventNames.map(
            e =>
              `${ipcConfig.listeners.dbListenerPrefix}:${collectionName}:${e}`,
          );
        }

        createProxyListener({
          remove: removeListeners,
        })(undefined);
      };
    }

    return db;
  },

  getKeyDb: async () => {
    const { error, result: methods } = await ipcRenderer.invoke(
      ipcConfig.methods.keyDbMethodList,
    );

    if (error) throw error;

    return createObjectProxy({
      key: ipcConfig.methods.keyDbMethodCall,
      methods,
    });
  },
};

for (const func of exportedFunctions) {
  (electronAPI as any)[func.name] = createProxyFunction(func.key);
}

for (const func of exportedListeners) {
  (electronAPI as any)[func.name] = createProxyListener(func);
}

const cysyncEnv: any = {};
for (const env of ipcConfig.env) {
  cysyncEnv[env] = process.env[env];
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('cysyncEnv', cysyncEnv);
