import {
  DatabaseError,
  DatabaseErrorType,
  IKeyValueStore,
} from '@cypherock/db-interfaces';
import JsonDB, { Collection } from 'lokijs';

import * as validator from './utils/validator';

interface KeyCollection {
  index: number;
  key: string;
  value: string;
}

export class KeyValueStore implements IKeyValueStore {
  private readonly db: JsonDB;

  private readonly collection: Collection<KeyCollection>;

  constructor(db: JsonDB) {
    this.db = db;
    this.collection = db.addCollection<KeyCollection>('keyvalue');
  }

  async getLength(): Promise<number> {
    try {
      return this.collection.count();
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.GET_FAILED,
        `Couldn't fetch length [${error.code}]: ${error.message}`,
      );
    }
  }

  async key(index: number): Promise<string | null> {
    validator.validateIndex(index);
    try {
      return this.collection.findOne({ index })?.value ?? null;
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.GET_FAILED,
        `Couldn't fetch key [${error.code}]: ${error.message}`,
      );
    }
  }

  async getItem(keyName: string): Promise<string | null> {
    validator.validateStrings(keyName);
    try {
      return this.collection.findOne({ key: keyName })?.value ?? null;
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.GET_FAILED,
        `Couldn't get item [${error.code}]: ${error.message}`,
      );
    }
  }

  async setItem(keyName: string, keyValue: string): Promise<void> {
    validator.validateStrings(keyName, keyValue);
    try {
      const obj = this.collection.findOne({ key: keyName });
      if (obj) {
        this.collection.update({ ...obj, value: keyValue });
      } else {
        this.collection.insert({
          index: await this.getLength(),
          key: keyName,
          value: keyValue,
        });
      }
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.INSERT_FAILED,
        `Couldn't set item [${error.code}]: ${error.message}`,
      );
    }
  }

  async removeItem(keyName: string): Promise<void> {
    validator.validateStrings(keyName);
    try {
      this.collection.removeWhere({ key: keyName });
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't remove item [${error.code}]: ${error.message}`,
      );
    }
  }

  async clear(): Promise<void> {
    try {
      this.collection.clear({ removeIndices: true });
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't clear the storage [${error.code}]: ${error.message}`,
      );
    }
  }

  async close() {
    this.db.close();
  }
}
