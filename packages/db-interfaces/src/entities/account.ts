import type { IAsset } from './asset';
import type { IBaseRepository, ObjectLiteral } from './baseRepository';
import type { IWallet } from './wallet';

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
  getWallet(account: IAccount): Promise<IWallet>;
  getChildren(account: IAccount): Promise<IAccount[]>;
  getParent(account: IAccount): Promise<IAccount>;
  getAsset(account: IAccount): Promise<IAsset>;
}
