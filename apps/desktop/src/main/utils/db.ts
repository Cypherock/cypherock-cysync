import { createDb, createKeyValueStore } from '@cypherock/database';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';
import path from 'path';
import { config } from './config';

let db: IDatabase | undefined;

let keyDb: IKeyValueStore | undefined;

export async function initializeAndGetDb() {
  const dbPath = path.join(config.USER_DATA_PATH, 'cysync-data/');

  if (!db) {
    db = await createDb(dbPath);
  }

  if (!keyDb) {
    keyDb = await createKeyValueStore(dbPath);
  }

  return { db, keyDb };
}
