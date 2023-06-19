import {
  IDatabase,
  IKeyValueStore,
  ObjectLiteral,
} from '@cypherock/db-interfaces';
import lodash from 'lodash';
import { createDb, createKeyValueStore } from '../../src';

class TestHelper {
  public db: IDatabase;

  public keyValueStore: IKeyValueStore;

  async setupTestDB() {
    this.db = await createDb(':memory:');
    await this.db.load();

    this.keyValueStore = await createKeyValueStore(':memory:');
  }

  teardownTestDB() {
    if (this.db) {
      this.db.close();
    }
    if (this.keyValueStore) {
      this.keyValueStore.close();
    }
  }
}

export const removeBaseFelids = (obj: ObjectLiteral): ObjectLiteral => {
  if (Array.isArray(obj)) {
    return obj.map(removeBaseFelids);
  }

  const newObj = { ...obj };

  delete newObj.__id;
  delete newObj.__version;
  delete newObj.meta;
  delete newObj.$loki;

  return newObj;
};

export const removeLokiFields = (obj: ObjectLiteral): ObjectLiteral => {
  if (Array.isArray(obj)) {
    return obj.map(removeLokiFields);
  }

  const newObj = { ...obj };

  delete newObj.meta;
  delete newObj.$loki;

  return newObj;
};

export const compareEntityArray = (a: any[], b: any[]) => {
  expect(removeLokiFields(lodash.sortBy(a, '__id'))).toEqual(
    removeLokiFields(lodash.sortBy(b, '__id')),
  );
};

export const testHelper = new TestHelper();
