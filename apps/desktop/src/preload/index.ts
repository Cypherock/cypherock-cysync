import { IDevice } from '@cypherock/sdk-interfaces';
import { contextBridge, ipcRenderer } from 'electron';

import {
  createObjectProxy,
  createProxyFunction,
  createProxyListener,
} from './utils';

import featureFlags from '../featureFlags';
import { ipcConfig } from '../main/ipc/helpers/config';

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
    name: 'getCySyncLogs',
    key: ipcConfig.methods.getCySyncLogs,
  },
  {
    name: 'closeApp',
    key: ipcConfig.methods.closeApp,
  },
  {
    name: 'focusApp',
    key: ipcConfig.methods.focusApp,
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
  {
    name: 'initWCUri',
    key: ipcConfig.methods.getInitialWCUri,
  },
  {
    name: 'getSystemInfo',
    key: ipcConfig.methods.getSystemInfo,
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
  {
    name: 'addExternalLinkListener',
    key: ipcConfig.listeners.wcConnection,
  },
  {
    name: 'removeExternalLinkListener',
    remove: [ipcConfig.listeners.wcConnection],
  },
  {
    name: 'addUsbChangeListener',
    key: ipcConfig.listeners.usbConnectionChange,
  },
  {
    name: 'removeUsbChangeListener',
    remove: [ipcConfig.listeners.usbConnectionChange],
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
      'transactionNotificationRead',
      'transactionNotificationClick',
    ];

    const eventNames = ['change'];

    for (const collectionName of collectionNameList) {
      const collection = db[collectionName];
      if (!collection) {
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
contextBridge.exposeInMainWorld('cysyncFeatureFlags', featureFlags);
