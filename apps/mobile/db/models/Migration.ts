import { Realm } from '@realm/react';

export class Migration extends Realm.Object {
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

  _id!: Realm.BSON.ObjectId;
  id!: string;
  ranAt!: number;
  isSuccessful!: boolean;
}
