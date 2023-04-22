import type { IBaseRepository } from './BaseRepository';
import type { IAccount } from './Account';
import type { IDevice } from './Device';

export interface IWallet {
  id: string;
  name: string;
  pinExists: boolean;
  passphraseExists: boolean;
}

export interface IWalletRepository extends IBaseRepository<IWallet> {
  getDevice(IWallet): Promise<IDevice>;
  getAccounts(IWallet): Promise<IAccount[]>;
}
