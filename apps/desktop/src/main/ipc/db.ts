import { IDatabase } from '@cypherock/db-interfaces';
import { WebContents } from 'electron';

import { ipcConfig } from './helpers/config';
import { callMethodOnObject, getMethodListFromObject } from './helpers/utils';

import { initializeAndGetDb } from '../utils';

export const setupDbListeners = async (webContents: WebContents) => {
  const { db } = await initializeAndGetDb();
  const collectionNameList: (keyof IDatabase)[] = [
    'account',
    'wallet',
    'transaction',
    'device',
    'priceHistory',
    'priceInfo',
  ];

  for (const collectionName of collectionNameList) {
    const collection = db[collectionName] as any;

    if (collection.addListener) {
      collection.addListener('change', () =>
        webContents.send(
          `${ipcConfig.listeners.dbListenerPrefix}:${collectionName}:change`,
        ),
      );
    }
  }
};

const dbMethodList = async () =>
  getMethodListFromObject((await initializeAndGetDb()).db, 2);

const dbMethodCall = async (method: string, ...args: any[]) =>
  callMethodOnObject((await initializeAndGetDb()).db, method, ...args);

const keyDbMethodList = async () =>
  getMethodListFromObject((await initializeAndGetDb()).keyDb, 2);

const keyDbMethodCall = async (method: string, ...args: any[]) =>
  callMethodOnObject((await initializeAndGetDb()).keyDb, method, ...args);

export const getDbIPCHandlers = () => [
  {
    name: ipcConfig.methods.dbMethodCall,
    func: dbMethodCall,
  },
  {
    name: ipcConfig.methods.dbMethodList,
    func: dbMethodList,
  },
  {
    name: ipcConfig.methods.keyDbMethodCall,
    func: keyDbMethodCall,
  },
  {
    name: ipcConfig.methods.keyDbMethodList,
    func: keyDbMethodList,
  },
];
