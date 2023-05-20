/* eslint-disable no-use-before-define */
import Database, { Database as DatabaseType } from 'better-sqlite3';
import { ObjectLiteral } from '@cypherock/db-interfaces';
import { Database as DB } from '../../src/database';

class TestHelper {
  private testDb!: DatabaseType;

  private storageDb!: DatabaseType;

  public db!: DB;

  async setupTestDB() {
    // const logger = console.log;
    const logger = undefined;
    this.testDb = new Database(':memory:', { verbose: logger });
    this.testDb.pragma('journal_mode = WAL');
    this.storageDb = new Database(':memory:', { verbose: logger });
    this.storageDb.pragma('journal_mode = WAL');

    this.db = new DB(this.testDb, this.storageDb);
  }

  teardownTestDB() {
    this.testDb.close();
  }
}

export const removeBaseFelids = (obj: ObjectLiteral) => ({
  ...obj,
  __id: undefined,
  __version: undefined,
});
export const testHelper = new TestHelper();
