import { IDatabase } from '@cypherock/db-interfaces';
import { IDevice, IDeviceConnection } from '@cypherock/sdk-interfaces';
import { LogWithServiceAndMethod } from './logger';

export type GetDevices = () => Promise<IDevice[]>;
export type ConnectDevice = (device: IDevice) => Promise<IDeviceConnection>;
export type GetDb = () => Promise<IDatabase>;

export interface IElectronAPI {
  logWithServiceAndLevel: LogWithServiceAndMethod;
  getDevices: GetDevices;
  connectDevice: ConnectDevice;
  getDb: GetDb;
}
