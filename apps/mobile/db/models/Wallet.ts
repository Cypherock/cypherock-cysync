import { ObjectLiteral } from '@cypherock/db-interfaces';
import Realm from 'realm';

export class Wallet extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'Wallet',
    primaryKey: '__id',
    properties: {
      __id: 'string',
      name: 'string',
      hasPin: 'bool',
      hasPassphrase: 'bool',
      deviceId: 'string',
      meta: 'mixed?',
    },
  };

  __id!: string;
  name!: string;
  hasPin!: boolean;
  hasPassphrase!: boolean;
  deviceId!: string;
  meta?: ObjectLiteral;
}
