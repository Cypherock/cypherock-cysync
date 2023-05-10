/* eslint-disable no-use-before-define */
import Database from 'better-sqlite3';
import { ObjectLiteral } from '@cypherock/db-interfaces';
import { Database as DB, initializeDb } from '../../src/database';

class TestHelper {
  private testdb!: any;

  public db!: DB;

  async setupTestDB() {
    this.testdb = new Database(':memory:', { verbose: console.log });
    // this.testdb = new Database(':memory:');
    this.testdb.pragma('journal_mode = WAL');

    this.db = await initializeDb(this.testdb);
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
