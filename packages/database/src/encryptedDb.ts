import { DatabaseError, DatabaseErrorType } from '@cypherock/db-interfaces';
import fs from 'fs';
import { throttle, DebouncedFunc } from 'lodash';
import JsonDB from 'lokijs';
import logger from './utils/logger';

export class EncryptedDB {
  private readonly database: JsonDB;

  private readonly key?: string;

  private readonly dbPath: string;

  private readonly throttledHandleChange: DebouncedFunc<() => Promise<void>>;

  private isClosed = false;

  private constructor(dbPath: string, db: JsonDB, key?: string) {
    this.database = db;
    this.key = key;
    this.dbPath = dbPath;
    this.throttledHandleChange = throttle(this.handleChange.bind(this), 500);
  }

  public static async create(dbPath: string, key?: string) {
    let data = '';

    if (dbPath !== ':memory:') {
      data = await EncryptedDB.loadDB(dbPath);
    }

    const db = new JsonDB(dbPath);
    db.loadJSON(data);

    return new EncryptedDB(dbPath, db, key);
  }

  public async getDB(): Promise<JsonDB> {
    if (this.isClosed) {
      throw new DatabaseError(DatabaseErrorType.DATABASE_CLOSED);
    }

    return this.database;
  }

  public async onChange() {
    if (this.dbPath === ':memory:') return;

    await this.throttledHandleChange();
  }

  public async close() {
    this.isClosed = true;
    await this.saveDB();
    this.database.close();
  }

  private async handleChange() {
    await this.saveDB();
  }

  private async saveDB() {
    if (this.dbPath === ':memory:') return;

    const data = this.database.serialize();
    await fs.promises.writeFile(this.dbPath, JSON.stringify({ data }));
  }

  private static async loadDB(path: string) {
    if (path === ':memory:') return '';

    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path);
      try {
        return JSON.parse(data.toString()).data ?? '';
      } catch (error) {
        logger.error(error);
        logger.error('Corrupt data found in database file, removing...');
        await fs.promises.writeFile(path, JSON.stringify({ data: '' }));

        return '';
      }
    }

    return '';
  }
}
