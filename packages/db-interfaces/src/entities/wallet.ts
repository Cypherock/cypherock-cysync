import type { IBaseRepository } from './baseRepository';
import type { IAccount } from './account';
import type { IDevice } from './device';

export interface IWallet {
  id: string;
  name: string;
  hasPin: boolean;
  hasPassphrase: boolean;
}

export interface IWalletRepository extends IBaseRepository<IWallet> {
  getDevice(wallet: IWallet): Promise<IDevice>;
  getAccounts(wallet: IWallet): Promise<IAccount[]>;
}
