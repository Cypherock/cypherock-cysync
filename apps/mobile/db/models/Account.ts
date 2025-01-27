import Realm from 'realm';

export class Account extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'Account',
    primaryKey: '__id',
    properties: {
      __id: 'string',
      name: 'string',
      xpubOrAddress: 'string',
      balance: 'string',
      spendableBalance: 'string?',
      unit: 'string?',
      derivationScheme: 'string?',
      derivationPath: 'string',
      type: 'string',
      extraData: 'string?',
      assetId: 'string',
      familyId: 'string',
      walletId: 'string',
      parentAssetId: 'string',
      parentAccountId: 'string?',
      isHidden: 'bool?',
    },
  };

  __id!: string;
  name!: string;
  xpubOrAddress!: string;
  balance!: string;
  spendableBalance?: string;
  unit?: string;
  derivationScheme?: string;
  derivationPath!: string;
  type!: string;
  extraData?: string;
  assetId!: string;
  familyId!: string;
  walletId!: string;
  parentAssetId!: string;
  parentAccountId?: string;
  isHidden?: boolean;
}
