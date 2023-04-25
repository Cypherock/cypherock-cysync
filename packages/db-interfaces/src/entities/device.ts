import type { IBaseRepository } from './baseRepository';
import type { IWallet } from './wallet';

export interface IDevice {
  serial: string;
  version: string;
  isAuthenticated: boolean;
}

export interface IDeviceRepository extends IBaseRepository<IDevice> {
  getWallets(device: IDevice): Promise<IWallet[]>;
}
