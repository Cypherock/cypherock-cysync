import { IDatabase, IRepository } from '@cypherock/db-interfaces';
import { WebContents } from 'electron';

import { ipcConfig } from './helpers/config';
import { callMethodOnObject, getMethodListFromObject } from './helpers/utils';

import { initializeAndGetDb } from '../utils';

const collectionNameList: (keyof IDatabase)[] = [
  'account',
  'wallet',
  'transaction',
  'device',
  'priceHistory',
  'priceInfo',
  'transactionNotificationRead',
  'transactionNotificationClick',
];

export const setupDbListeners = async (webContents: WebContents) => {
  const { db } = await initializeAndGetDb();

  for (const collectionName of collectionNameList) {
    const collection = db[collectionName] as IRepository<any>;

    if (collection.addListener) {
      collection.addListener('change', () =>
        webContents.send(
          `${ipcConfig.listeners.dbListenerPrefix}:${collectionName}:change`,
        ),
      );
    }
  }
};

export const removeDbListeners = async () => {
  const { db } = await initializeAndGetDb();

  for (const collectionName of collectionNameList) {
    const collection = db[collectionName] as IRepository<any>;

    if (collection.removeAllListener) {
      collection.removeAllListener('change');
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
