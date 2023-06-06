import fs from 'fs';
import { debounce, DebouncedFunc } from 'lodash';
import SQLDatabase, { Database as DB } from 'better-sqlite3';
import logger from './utils/logger';

export class EncryptedDB {
  private readonly database: DB;

  private readonly key?: string;

  private readonly dbPath: string;

  private readonly debouncedHandleChange: DebouncedFunc<() => Promise<void>>;

  private constructor(dbPath: string, db: DB, key?: string) {
    this.database = db;
    this.key = key;
    this.dbPath = dbPath;
    this.debouncedHandleChange = debounce(this.handleChange.bind(this), 500);
  }

  public static async create(dbPath: string, key?: string) {
    let db: DB;

    if (dbPath === ':memory:') {
      db = new SQLDatabase(dbPath, {
        verbose: logger.debug as any,
      });
    } else {
      const data = await EncryptedDB.readFile(dbPath);

      db = new SQLDatabase(data, {
        verbose: logger.debug as any,
      });
    }

    db.pragma('journal_mode = WAL');

    return new EncryptedDB(dbPath, db, key);
  }

  public async getDB(): Promise<DB> {
    return this.database;
  }

  public async onChange() {
    if (this.dbPath === ':memory:') return;

    await this.debouncedHandleChange();
  }

  public async close() {
    await this.saveDB();
    this.database.close();
  }

  private async handleChange() {
    await this.saveDB();
  }

  private async saveDB() {
    if (this.dbPath === ':memory:') return;

    const data = this.database.serialize();
    await EncryptedDB.writeFile(this.dbPath, data);
  }

  private static async writeFile(path: string, data: Buffer) {
    await fs.promises.writeFile(path, data);
  }

  private static async readFile(path: string) {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path);
      return data;
    }

    return Buffer.from('');
  }
}
