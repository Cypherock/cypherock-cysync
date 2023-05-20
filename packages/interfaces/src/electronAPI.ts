import { IDevice, IDeviceConnection } from '@cypherock/sdk-interfaces';
import { LogWithServiceAndMethod } from './logger';

export type GetDevices = () => Promise<IDevice[]>;
export type ConnectDevice = (device: IDevice) => Promise<IDeviceConnection>;

export interface IElectronAPI {
  logWithServiceAndLevel: LogWithServiceAndMethod;
  getDevices: GetDevices;
  connectDevice: ConnectDevice;
}
