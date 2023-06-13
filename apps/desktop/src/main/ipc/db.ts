import { initializeAndGetDb } from '../utils';
import { ipcConfig } from './helpers/config';
import { callMethodOnObject, getMethodListFromObject } from './helpers/utils';

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
