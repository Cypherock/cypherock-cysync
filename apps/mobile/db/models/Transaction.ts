import { Realm } from '@realm/react';

export class Transaction extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  hash!: string;
  fees!: string;
  amount!: string;
  status!: string;
  type!: string;
  timestamp!: number;
  blockHeight!: number;
  inputs!: Realm.List<any>;
  outputs!: Realm.List<any>;
  accountId!: string;
  confirmations?: number;
  extraData?: object;
  assetId!: string;
  walletId!: string;
  familyId!: string;
  parentTransactionId?: string;
  parentAccountId?: string;
  parentAssetId!: string;
  subType?: string;
  customId?: string;
  description?: string;
  remarks?: Realm.List<any>;

  static schema = {
    name: 'Transaction',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      hash: 'string',
      fees: 'string',
      amount: 'string',
      status: 'string',
      type: 'string',
      timestamp: 'int',
      blockHeight: 'int',
      inputs: 'list',
      outputs: 'list',
      accountId: 'string',
      confirmations: 'int?',
      extraData: 'object?',
      assetId: 'string',
      walletId: 'string',
      familyId: 'string',
      parentTransactionId: 'string?',
      parentAccountId: 'string?',
      parentAssetId: 'string',
      subType: 'string?',
      customId: 'string?',
      description: 'string?',
      remarks: 'list?',
    },
  };
}
