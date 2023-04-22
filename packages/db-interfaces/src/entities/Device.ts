import { IBaseRepository } from './BaseRepository';
import { IWallet } from './Wallet';

export interface IDevice {
  serial: string;
  version: string;
  authenticated: boolean;
}

export interface IDeviceRepository extends IBaseRepository<IDevice> {
  getWallets(IDevice): Promise<IWallet[]>;
}
