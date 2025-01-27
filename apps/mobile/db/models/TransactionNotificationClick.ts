import { ITransactionNotificationClick } from '@cypherock/db-interfaces';
import { Realm } from '@realm/react';

export class TransactionNotificationClick extends Realm.Object<ITransactionNotificationClick> {
  static schema: Realm.ObjectSchema = {
    name: 'TransactionNotificationClick',
    primaryKey: '__id',
    properties: {
      __id: 'string',
      transactionId: 'string',
      isClicked: 'bool',
      transactionStatus: 'string',
    },
  };

  __id!: string;
  transactionId!: string;
  isClicked!: boolean;
  transactionStatus!: string;
}
