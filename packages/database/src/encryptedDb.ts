import fs from 'fs';
import path from 'path';

import { ResourceLock } from '@cypherock/cysync-utils';
import { DatabaseError, DatabaseErrorType } from '@cypherock/db-interfaces';
import { throttle, DebouncedFunc } from 'lodash';
import JsonDB from 'lokijs';
import * as uuid from 'uuid';

import { encryptData, decryptData, createHash } from './utils/encryption';
import logger from './utils/logger';

interface IFileData {
  isEncrypted: boolean;
  data: string;
}

export class EncryptedDB {
  private readonly dbPath: string;

  private readonly backupDbPath: string;

  private readonly throttledHandleChange: DebouncedFunc<() => Promise<void>>;

  private isClosed = false;

  private isLoadedFromFile = false;

  private key?: Buffer;

  private database: JsonDB;

  private readonly dbResourceLock: ResourceLock<string>;

  private constructor(dbPath: string, db: JsonDB) {
    this.database = db;
    this.dbPath = dbPath;
    this.throttledHandleChange = throttle(this.handleChange.bind(this), 500);
    this.dbResourceLock = new ResourceLock(k => k, {
      maxLockTime: 10000,
      timeout: 10000,
    });

    const baseFileName = path.basename(this.dbPath);
    this.backupDbPath = path.join(dbPath, '..', `.backup-${baseFileName}`);
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
      const data = await EncryptedDB.loadDB(
        this.dbPath,
        this.backupDbPath,
        this.key,
      );
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

  public async clear() {
    await this.unload();

    if (this.dbPath === ':memory:') return;
    try {
      await fs.promises.unlink(this.dbPath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private async handleChange() {
    await this.saveDB();
  }

  private async saveDB() {
    if (this.dbPath === ':memory:') return;

    let data = this.database.serialize();
    let isEncrypted = false;

    if (this.key) {
      data = await encryptData(data, this.key);
      isEncrypted = true;
    }

    const fileData: IFileData = { isEncrypted, data };

    const runId = uuid.v4();

    try {
      await this.dbResourceLock.acquire(this.dbPath, runId);

      await fs.promises.writeFile(this.dbPath, JSON.stringify(fileData));

      await fs.promises.writeFile(this.backupDbPath, JSON.stringify(fileData));
    } catch (error) {
      logger.warn(error);
      logger.warn('Error while saving DB, failed to aquire resourceLock');
    } finally {
      this.dbResourceLock.release(this.dbPath, runId);
    }
  }

  private static async loadDB(
    dbPath: string,
    backupDbPath: string,
    key?: Buffer,
  ) {
    if (dbPath === ':memory:') return '';

    logger.info('Loading database...');
    const doesDbFileExists = fs.existsSync(dbPath);
    const doesBackupDbFileExists = fs.existsSync(backupDbPath);
    let fileData: IFileData | undefined;

    if (!doesDbFileExists && !doesBackupDbFileExists) {
      return '';
    }

    if (doesDbFileExists) {
      const dbFileData = await EncryptedDB.readDBFile(dbPath);
      if (dbFileData) {
        fileData = dbFileData;
      }
    }

    if (!fileData && doesBackupDbFileExists) {
      logger.info('Loading database backup...');
      const backupFileData = await EncryptedDB.readDBFile(backupDbPath);
      if (backupFileData) {
        fileData = backupFileData;
        logger.info('Writing backup db to main db file...');
        await fs.promises.writeFile(
          backupDbPath,
          JSON.stringify(backupFileData),
        );
      }
    }

    if (!fileData) {
      logger.error('Corrupt data found in both database files, removing...');
      await fs.promises.writeFile(dbPath, JSON.stringify({ data: '' }));
      await fs.promises.writeFile(backupDbPath, JSON.stringify({ data: '' }));

      return '';
    }

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

  private static async readDBFile(dbPath: string) {
    const data = await fs.promises.readFile(dbPath);

    try {
      const fileData = JSON.parse(data.toString()) as IFileData;
      return fileData;
    } catch (error) {
      logger.warn(error);
      logger.warn(`Corrupt data found in ${path.basename(dbPath)}`);
      return undefined;
    }
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
