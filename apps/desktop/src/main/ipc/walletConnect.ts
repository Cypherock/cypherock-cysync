import { WebContents } from 'electron';

import { ipcConfig } from './helpers/config';

import { getWCUri, setWCUri } from '../utils';

let sendWCConnectionString: ((connectionString: string) => void) | undefined;

const initWCUri = async () => {
  const wcUriCopy = getWCUri();
  setWCUri(null);
  return wcUriCopy;
};

export const getWalletConnectIPCHandlers = () => [
  {
    name: ipcConfig.methods.initWCUri,
    func: initWCUri,
  },
];
export const setupWalletConnectListeners = async (webContents: WebContents) => {
  sendWCConnectionString = (connectionString: string) => {
    webContents.send(ipcConfig.listeners.wcConnection, connectionString);
  };
};

export const getSendWCConnectionString = () => {
  if (!sendWCConnectionString)
    throw new Error('sendWCConnectionString not initialized');
  return sendWCConnectionString;
};
