import { Realm } from '@realm/react';

export class Migration extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  id!: string;
  ranAt!: number;
  isSuccessful!: boolean;

  static schema = {
    name: 'Migration',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      id: 'string',
      ranAt: 'int',
      isSuccessful: 'bool',
    },
  };
}
