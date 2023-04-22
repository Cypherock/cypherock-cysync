import type { IAsset } from './Asset';
import type { IBaseRepository, ObjectLiteral } from './BaseRepository';
import type { IWallet } from './Wallet';

export interface IAccount {
  id: string;
  name: string;
  xpub: string;
  balance: string;
  unit: string;
  derivationPath: string;
  type: string;
  assetSpecificData: ObjectLiteral;
}

export interface IAccountRepository extends IBaseRepository<IAccount> {
  getWallets(account: IAccount): Promise<IWallet[]>;
  getChildren(account: IAccount): Promise<IAccount[]>;
  getParent(account: IAccount): Promise<IAccount>;
  getAssets(account: IAccount): Promise<IAsset[]>;
}
