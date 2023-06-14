import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';
import { IDevice, IDeviceConnection } from '@cypherock/sdk-interfaces';
import { LogWithServiceAndMethod } from './logger';

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
}
