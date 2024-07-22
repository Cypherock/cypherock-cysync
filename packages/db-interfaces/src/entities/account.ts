import type { IEntity, IGetOptions, IRepository, ObjectLiteral } from './base';

export const AccountTypeMap = {
  account: 'account',
  subAccount: 'subAccount',
} as const;

export type AccountType = (typeof AccountTypeMap)[keyof typeof AccountTypeMap];

export interface IAccount extends IEntity {
  name: string;
  xpubOrAddress: string;
  balance: string;
  unit?: string;
  derivationScheme?: string;
  derivationPath: string;
  type: AccountType;
  extraData?: ObjectLiteral;
  // foreign keys
  assetId: string;
  familyId: string;
  walletId: string;
  parentAssetId: string;
  parentAccountId?: string;
  isHidden?: boolean;
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
