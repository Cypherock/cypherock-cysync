import type { IEntity, IRepository, IGetOptions, ObjectLiteral } from './base';

export interface IAccount extends IEntity {
  name: string;
  xpubOrAddress: string;
  balance: string;
  unit: string;
  derivationPath: string;
  type: string;
  extraData?: ObjectLiteral;
  // foreign keys
  assetId: string;
  familyId: string;
  walletId: string;
  parentAssetId?: string;
  parentAccountId?: string;
}

export interface IAccountDisplayInfo extends IAccount {
  value: string; // balance in USD
  childrenAccounts?: IAccountDisplayInfo[]; // tokens or custom accounts
}

export interface IAccountRepository extends IRepository<IAccount> {
  getDisplayAccounts: (
    params: IGetOptions<IAccount>,
  ) => Promise<IAccountDisplayInfo[]>;
}
