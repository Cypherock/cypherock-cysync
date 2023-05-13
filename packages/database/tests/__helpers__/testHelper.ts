/* eslint-disable no-use-before-define */
import Database, { Database as DatabaseType } from 'better-sqlite3';
import { ObjectLiteral } from '@cypherock/db-interfaces';
import { Database as DB } from '../../src/database';

class TestHelper {
  private testdb!: DatabaseType;

  public db!: DB;

  async setupTestDB() {
    // this.testdb = new Database('test.sqlite', { verbose: console.log });
    this.testdb = new Database(':memory:');
    this.testdb.pragma('journal_mode = WAL');

    this.db = new DB(this.testdb);
  }

  teardownTestDB() {
    this.testdb.close();
  }
}

export const removeBaseFelids = (obj: ObjectLiteral) => ({
  ...obj,
  __id: undefined,
  __version: undefined,
});
export const testHelper = new TestHelper();
