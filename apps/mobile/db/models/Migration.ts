import Realm from 'realm';

export class Migration extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'Migration',
    primaryKey: '__id',
    properties: {
      __id: 'string',
      id: 'string',
      ranAt: 'int',
      isSuccessful: 'bool',
    },
  };

  __id!: string;
  id!: string;
  ranAt!: number;
  isSuccessful!: boolean;
}
