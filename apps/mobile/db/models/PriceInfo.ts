import { ObjectLiteral } from '@cypherock/db-interfaces';
import { Realm } from '@realm/react';

export class PriceInfo extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'PriceInfo',
    primaryKey: '__id',
    properties: {
      __id: 'string',
      currency: 'string',
      latestPrice: 'string',
      assetId: 'string',
      lastSyncedAt: 'int',
      meta: 'mixed?',
    },
  };

  __id!: string;
  currency!: string;
  latestPrice!: string;
  assetId!: string;
  lastSyncedAt!: number;
  meta?: ObjectLiteral;
}
