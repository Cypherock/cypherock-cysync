import { Realm } from '@realm/react';

export class PriceHistory extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  days!: number;
  history!: Realm.List<any>;
  assetId!: string;
  currency!: string;

  static schema = {
    name: 'PriceHistory',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      days: 'int',
      history: 'list',
      assetId: 'string',
      currency: 'string',
    },
  };
}
