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
  getWallets(IAccount): Promise<IWallet[]>;
  getChildren(IAccount): Promise<IAccount[]>;
  getParent(IAccount): Promise<IAccount>;
  getAssets(IAccount): Promise<IAsset[]>;
}
