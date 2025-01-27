import { Realm } from '@realm/react';

export class TransactionNotificationRead extends Realm.Object {
  static schema = {
    name: 'TransactionNotificationRead',
    primaryKey: '__id',
    properties: {
      __id: 'string',
      transactionId: 'string',
      transactionStatus: 'string',
      isRead: 'bool',
    },
  };

  __id!: string;
  transactionId!: string;
  transactionStatus!: string;
  isRead!: boolean;
}
