/* eslint-disable no-use-before-define */
import { DataSource, DataSourceOptions } from 'typeorm';
import Database from 'better-sqlite3';
import { Database as DB, initializeDb } from '../../src/database';

class TestHelper {
  private dbConnect!: DataSource;

  private testdb!: any;

  public db!: DB;

  async setupTestDB() {
    this.testdb = new Database(':memory:', { verbose: console.log });

    this.dbConnect = new DataSource({
      name: 'TestDB',
      type: 'better-sqlite3',
      database: 'testdb.sqlite',
      entities: ['src/entity/*.ts'],
      synchronize: true,
    } as DataSourceOptions);
    this.db = await initializeDb(this.dbConnect);
  }

  teardownTestDB() {
    this.dbConnect.destroy();
    this.testdb.close();
  }
}

export const testHelper = new TestHelper();
