import Realm from 'realm';
import { ObjectLiteral } from '@cypherock/db-interfaces';

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
      extraData: 'mixed',
      meta: 'mixed?',
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
  extraData?: ObjectLiteral;
  meta?: ObjectLiteral;
  assetId!: string;
  familyId!: string;
  walletId!: string;
  parentAssetId!: string;
  parentAccountId?: string;
  isHidden?: boolean;
}
