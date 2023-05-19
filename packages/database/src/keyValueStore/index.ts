import {
  DatabaseError,
  DatabaseErrorType,
  IKeyValueStore,
} from '@cypherock/db-interfaces';
import { Database } from 'better-sqlite3';
import * as sqlParser from './utils/sqlParser';
import * as validator from './utils/validator';

export class KeyValueStore implements IKeyValueStore {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
    try {
      sqlParser.createTable(db);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.DATABASE_CREATION_FAILED,
        `Couldn't create tables [${error.code}]: ${error.message}`,
      );
    }
  }

  async getLength(): Promise<number> {
    try {
      return sqlParser.countTableRows(this.db) as any;
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
      return sqlParser.getNthKey(this.db, index);
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
      return sqlParser.getValue(this.db, keyName);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.GET_FAILED,
        `Couldn't get item [${error.code}]: ${error.message}`,
      );
    }
  }

  async setItem(keyName: string, keyValue: string): Promise<void> {
    validator.validateStrings(keyName, keyValue);
    let changes = 0;
    try {
      changes = sqlParser.insertPair(this.db, keyName, keyValue);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.INSERT_FAILED,
        `Couldn't set item [${error.code}]: ${error.message}`,
      );
    }
    if (changes === 0) throw new DatabaseError(DatabaseErrorType.INSERT_FAILED);
  }

  async removeItem(keyName: string): Promise<void> {
    validator.validateStrings(keyName);
    let changes = 0;
    try {
      changes = sqlParser.removePair(this.db, keyName);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't remove item [${error.code}]: ${error.message}`,
      );
    }
    if (changes === 0) throw new DatabaseError(DatabaseErrorType.REMOVE_FAILED);
  }

  async clear(): Promise<void> {
    let changes = 0;
    try {
      changes = sqlParser.truncateTable(this.db);
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.REMOVE_FAILED,
        `Couldn't clear the storage [${error.code}]: ${error.message}`,
      );
    }
    if (changes === 0) throw new DatabaseError(DatabaseErrorType.REMOVE_FAILED);
  }
}
