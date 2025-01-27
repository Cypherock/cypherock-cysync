import { Realm } from '@realm/react';

export class TransactionNotificationRead extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  transactionId!: string;
  transactionStatus!: string;
  isRead!: boolean;

  static schema = {
    name: 'TransactionNotificationRead',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      transactionId: 'string',
      transactionStatus: 'string',
      isRead: 'bool',
    },
  };
}
