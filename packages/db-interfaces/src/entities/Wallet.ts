import { IBaseRepository } from './BaseRepository';
import { IAccount } from './Account';
import { IDevice } from './Device';

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
