import { IPriceSnapshot } from '@cypherock/db-interfaces';
import { Realm } from '@realm/react';

export class PriceHistory extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'PriceHistory',
    primaryKey: '__id',
    properties: {
      __id: 'string',
      days: 'int',
      history: 'mixed',
      assetId: 'string',
      currency: 'string',
    },
  };

  __id!: string;
  days!: number;
  history!: IPriceSnapshot;
  assetId!: string;
  currency!: string;
}
