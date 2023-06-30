import fs from 'fs';
import path from 'path';

import {
  DatabaseError,
  DatabaseErrorType,
  IKeyValueStore,
} from '@cypherock/db-interfaces';

import * as validator from './utils/validator';

import { EncryptedDB } from '../encryptedDb';

interface IKeyCollection {
  key: string;
  value: string;
}

export class KeyValueStore implements IKeyValueStore {
  private readonly encDb: EncryptedDB;

  private readonly name: 'keyvalue';

  private constructor(db: EncryptedDB) {
    this.encDb = db;
  }

  public static async create(dirPath: string) {
    let storagePath = path.join(dirPath, 'storage.db');

    if (dirPath === ':memory:') {
      storagePath = dirPath;
    } else if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const storageDb = await EncryptedDB.create(storagePath);
    await storageDb.load();

    return new KeyValueStore(storageDb);
  }

  async getItem(keyName: string): Promise<string | null> {
    validator.validateStrings(keyName);

    const collection = await this.getCollection();

    try {
      return collection.where(e => e.key === keyName).at(0)?.value ?? null;
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.GET_FAILED,
        `Couldn't get item [${error.code}]: ${error.message}`,
      );
    }
  }

  async setItem(keyName: string, keyValue: string): Promise<void> {
    validator.validateStrings(keyName, keyValue);
    const collection = await this.getCollection();

    try {
      const obj = collection.where(e => e.key === keyName).at(0);

      if (obj) {
        collection.update({ ...obj, value: keyValue });
      } else {
        collection.insert({
          key: keyName,
          value: keyValue,
        });
      }
      this.emitChange();
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.INSERT_FAILED,
        `Couldn't set item [${error.code}]: ${error.message}`,
      );
    }
  }

  async removeItem(keyName: string): Promise<void> {
    validator.validateStrings(keyName);
    const collection = await this.getCollection();

    try {
      collection.removeWhere({ key: keyName });
      this.emitChange();
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't remove item [${error.code}]: ${error.message}`,
      );
    }
  }

  async clear(): Promise<void> {
    await this.encDb.clear();
    await this.encDb.load();
  }

  async close() {
    this.encDb.close();
  }

  private async getCollection() {
    const db = await this.encDb.getDB();
    const collection = db.getCollection<IKeyCollection>(this.name);

    if (collection) {
      return collection;
    }

    return db.addCollection<IKeyCollection>(this.name, { unique: ['key'] });
  }

  private emitChange() {
    this.encDb.onChange();
  }
}
