import { Realm } from '@realm/react';

export class Device extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  serial!: string;
  isAuthenticated!: boolean;
  version!: string;

  static schema = {
    name: 'Device',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      serial: 'string',
      isAuthenticated: 'bool',
      version: 'string',
    },
  };
}
