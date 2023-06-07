import { ObjectLiteral } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import { Database as DB } from '../../src/database';

class TestHelper {
  public db: DB;

  async setupTestDB() {
    this.db = await DB.create(':memory:');
  }

  teardownTestDB() {
    if (this.db) {
      this.db.close();
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
