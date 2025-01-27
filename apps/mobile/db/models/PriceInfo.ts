import { Realm } from '@realm/react';

export class PriceInfo extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  currency!: string;
  latestPrice!: string;
  assetId!: string;
  lastSyncedAt!: number;

  static schema = {
    name: 'PriceInfo',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      currency: 'string',
      latestPrice: 'string',
      assetId: 'string',
      lastSyncedAt: 'int',
    },
  };
}
