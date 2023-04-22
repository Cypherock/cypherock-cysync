import type { IBaseRepository } from './BaseRepository';
import type { IWallet } from './Wallet';

export interface IDevice {
  serial: string;
  version: string;
  authenticated: boolean;
}

export interface IDeviceRepository extends IBaseRepository<IDevice> {
  getWallets(device: IDevice): Promise<IWallet[]>;
}
