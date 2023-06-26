import { createDb, createKeyValueStore } from '@cypherock/database';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';
import path from 'path';
import { config } from './config';

let db: IDatabase | undefined;

let keyDb: IKeyValueStore | undefined;

export const initializeAndGetDb = async () => {
  const dbPath = path.join(config.USER_DATA_PATH, 'cysync-data/');

  if (!db) {
    db = await createDb(dbPath);
  }

  if (!keyDb) {
    keyDb = await createKeyValueStore(dbPath);
  }

  return { db, keyDb };
};

export const clearDatabase = async () => {
  if (db) {
    await db.clear();
  }
  if (keyDb) {
    await keyDb.clear();
  }
};
