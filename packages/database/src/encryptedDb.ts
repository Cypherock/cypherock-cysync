import path from 'path';
import fs from 'fs';
import { throttle, DebouncedFunc } from 'lodash';
import JsonDB from 'lokijs';
import { DatabaseError, DatabaseErrorType } from '@cypherock/db-interfaces';

import logger from './utils/logger';
import { encryptData, decryptData, createHash } from './utils/encryption';

interface IFileData {
  isEncrypted: boolean;
  data: string;
}

export class EncryptedDB {
  private readonly dbPath: string;

  private readonly throttledHandleChange: DebouncedFunc<() => Promise<void>>;

  private isClosed = false;

  private isLoadedFromFile = false;

  private key?: Buffer;

  private database: JsonDB;

  private constructor(dbPath: string, db: JsonDB) {
    this.database = db;
    this.dbPath = dbPath;
    this.throttledHandleChange = throttle(this.handleChange.bind(this), 500);
  }

  public getPath() {
    return this.dbPath;
  }

  public static async create(dbPath: string) {
    const db = EncryptedDB.createJsonDB(dbPath);

    return new EncryptedDB(dbPath, db);
  }

  public async load(key?: string) {
    this.updateKey(key);

    if (this.dbPath !== ':memory:') {
      const data = await EncryptedDB.loadDB(this.dbPath, this.key);
      this.database.loadJSON(data);
    }

    this.isLoadedFromFile = true;
  }

  public async unload() {
    this.isLoadedFromFile = false;
    this.database = EncryptedDB.createJsonDB(this.dbPath);
  }

  public isLoaded() {
    return this.isLoadedFromFile;
  }

  public async getDB(): Promise<JsonDB> {
    if (this.isClosed) {
      throw new DatabaseError(DatabaseErrorType.DATABASE_CLOSED);
    }

    if (!this.isLoadedFromFile) {
      throw new DatabaseError(DatabaseErrorType.DATABASE_NOT_LOADED);
    }

    return this.database;
  }

  public async onChange() {
    if (this.dbPath === ':memory:') return;

    await this.throttledHandleChange();
  }

  public async changeEncryptionKey(key?: string) {
    this.updateKey(key);
    await this.saveDB();
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

    let data = this.database.serialize();
    let isEncrypted = false;

    logger.info('Saving DB', { key: this.key });
    if (this.key) {
      data = await encryptData(data, this.key);
      isEncrypted = true;
    }

    const fileData: IFileData = { isEncrypted, data };
    await fs.promises.writeFile(this.dbPath, JSON.stringify(fileData));
  }

  private static async loadDB(dbPath: string, key?: Buffer) {
    if (dbPath === ':memory:') return '';

    if (fs.existsSync(dbPath)) {
      const data = await fs.promises.readFile(dbPath);
      let fileData: IFileData;
      try {
        fileData = JSON.parse(data.toString()) as IFileData;
      } catch (error) {
        logger.error(error);
        logger.error('Corrupt data found in database file, removing...');
        await fs.promises.writeFile(dbPath, JSON.stringify({ data: '' }));

        return '';
      }

      logger.info('Loading database', { key });
      if (fileData.isEncrypted) {
        if (!key) {
          throw new Error('The database is encrypted but no key was provided');
        }

        if (fileData.data) {
          return decryptData(fileData.data, key);
        }
        return '';
      }

      return fileData.data;
    }

    return '';
  }

  private static createJsonDB(dbPath: string) {
    let dbName = ':memory:';

    if (dbPath !== ':memory:') {
      dbName = path.basename(dbPath);
    }

    const db = new JsonDB(dbName);
    return db;
  }

  private updateKey(key?: string) {
    if (key) {
      this.key = createHash(key);
    } else {
      this.key = undefined;
    }
  }
}
