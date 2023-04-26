import type {
  IBaseEntity,
  IBaseRepository,
  IGetOptions,
  ObjectLiteral,
} from './base';

export interface IAccount extends IBaseEntity {
  name: string;
  xpubOrAddress: string;
  balance: string;
  unit: string;
  derivationPath: string;
  type: string;
  extraData?: ObjectLiteral;
  // foreign keys
  assetId: string;
  walletId: string;
  parentAccountId?: string;
}

export interface IAccountDisplayInfo {
  value: string; // balance in USD
  childrenAccounts?: IAccountDisplayInfo[]; // tokens or custom accounts
}

export interface IAccountRepository extends IBaseRepository<IAccount> {
  getDisplayAccounts: (
    params: IGetOptions<IAccount>,
  ) => Promise<IAccountDisplayInfo[]>;
}
