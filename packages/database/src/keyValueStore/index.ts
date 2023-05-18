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

  getLength(): number {
    try {
      return sqlParser.countTableRows(this.db) as any;
    } catch (error: any) {
      throw new DatabaseError(
        DatabaseErrorType.GET_FAILED,
        `Couldn't fetch length [${error.code}]: ${error.message}`,
      );
    }
  }

  key(index: number): string | null {
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

  getItem(keyName: string): string | null {
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

  setItem(keyName: string, keyValue: string): void {
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

  removeItem(keyName: string): void {
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

  clear(): void {
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
