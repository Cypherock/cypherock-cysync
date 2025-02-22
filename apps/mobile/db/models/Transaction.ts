import { Realm } from '@realm/react';
import {
  ITransaction,
  ITransactionInputOutput,
  ObjectLiteral,
} from '@cypherock/db-interfaces';

export class Transaction extends Realm.Object<ITransaction> {
  static schema: Realm.ObjectSchema = {
    name: 'Transaction',
    primaryKey: '__id',
    properties: {
      __id: 'string',
      hash: 'string',
      fees: 'string',
      amount: 'string',
      status: 'string',
      type: 'string',
      timestamp: 'double',
      blockHeight: 'int',
      inputs: 'mixed',
      outputs: 'mixed',
      accountId: 'string',
      confirmations: 'int?',
      extraData: 'mixed',
      assetId: 'string',
      walletId: 'string',
      familyId: 'string',
      parentTransactionId: 'string?',
      parentAccountId: 'string?',
      parentAssetId: 'string',
      subType: 'string?',
      customId: 'string?',
      description: 'string?',
      remarks: 'mixed?',
      meta: 'mixed?',
    },
  };

  __id!: string;
  hash!: string;
  fees!: string;
  amount!: string;
  status!: string;
  type!: string;
  timestamp!: number;
  blockHeight!: number;
  inputs!: ITransactionInputOutput[];
  outputs!: ITransactionInputOutput[];
  accountId!: string;
  confirmations?: number;
  extraData!: ObjectLiteral;
  assetId!: string;
  walletId!: string;
  familyId!: string;
  parentTransactionId?: string;
  parentAccountId?: string;
  parentAssetId!: string;
  subType?: string;
  customId?: string;
  description?: string;
  remarks?: string[];
  meta?: ObjectLiteral;
}
