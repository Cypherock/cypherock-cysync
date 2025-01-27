import { Realm } from '@realm/react';

export class TransactionNotificationClick extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  transactionId!: string;
  isClicked!: boolean;
  transactionStatus!: string;

  static schema = {
    name: 'TransactionNotificationClick',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      transactionId: 'string',
      isClicked: 'bool',
      transactionStatus: 'string',
    },
  };
}
