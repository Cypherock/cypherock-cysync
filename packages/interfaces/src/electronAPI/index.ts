import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';
import { IDevice, IDeviceConnection } from '@cypherock/sdk-interfaces';

import {
  AddUpdateDownloadCompleteListener,
  AddUpdateDownloadErrorListener,
  AddUpdateDownloadProgressListener,
  CheckForUpdates,
  DownloadUpdate,
  InstallUpdate,
  RemoveUpdateDownloadListeners,
} from './updater';
import { LogWithServiceAndMethod } from '../logger';

export * from './updater';

export type GetDevices = () => Promise<IDevice[]>;
export type ConnectDevice = (device: IDevice) => Promise<IDeviceConnection>;
export type GetDb = () => Promise<IDatabase>;
export type GetKeyDb = () => Promise<IKeyValueStore>;

export interface IElectronAPI {
  logWithServiceAndLevel: LogWithServiceAndMethod;
  getDevices: GetDevices;
  connectDevice: ConnectDevice;
  getDb: GetDb;
  getKeyDb: GetKeyDb;
  checkForUpdates: CheckForUpdates;
  downloadUpdate: DownloadUpdate;
  installUpdate: InstallUpdate;
  addUpdateDownloadProgressListener: AddUpdateDownloadProgressListener;
  addUpdateDownloadCompletedListener: AddUpdateDownloadCompleteListener;
  addUpdateDownloadErrorListener: AddUpdateDownloadErrorListener;
  removeUpdateDownloadListeners: RemoveUpdateDownloadListeners;
}
