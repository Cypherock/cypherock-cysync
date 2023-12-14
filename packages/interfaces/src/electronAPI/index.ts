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
export type ResetCySync = () => Promise<void>;
export type CloseApp = () => Promise<void>;
export type GetCySyncLogs = () => Promise<string[]>;
export type FocusApp = () => Promise<void>;
export type InitWCUri = () => Promise<string | null>;
export type AddExternalLinkListener = (listener: (uri: string) => void) => void;
export type RemoveExternalLinkListener = () => Promise<void>;
export type AddUsbChangeListener = (listener: () => void) => void;
export type RemoveUsbChangeListener = () => Promise<void>;
export type GetSystemInfo = () => Promise<any>;

export interface IElectronAPI {
  logWithServiceAndLevel: LogWithServiceAndMethod;
  getDevices: GetDevices;
  connectDevice: ConnectDevice;
  getDb: GetDb;
  getKeyDb: GetKeyDb;
  resetCySync: ResetCySync;
  checkForUpdates: CheckForUpdates;
  downloadUpdate: DownloadUpdate;
  installUpdate: InstallUpdate;
  addUpdateDownloadProgressListener: AddUpdateDownloadProgressListener;
  addUpdateDownloadCompletedListener: AddUpdateDownloadCompleteListener;
  addUpdateDownloadErrorListener: AddUpdateDownloadErrorListener;
  removeUpdateDownloadListeners: RemoveUpdateDownloadListeners;
  closeApp: CloseApp;
  focusApp: FocusApp;
  initWCUri: InitWCUri;
  addExternalLinkListener: AddExternalLinkListener;
  removeExternalLinkListener: RemoveExternalLinkListener;
  getCySyncLogs: GetCySyncLogs;
  getSystemInfo: GetSystemInfo;
  addUsbChangeListener: AddUsbChangeListener;
  removeUsbChangeListener: RemoveUsbChangeListener;
}
