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
    },
  };

  __id!: string;
  name!: string;
  hasPin!: boolean;
  hasPassphrase!: boolean;
  deviceId!: string;
}
