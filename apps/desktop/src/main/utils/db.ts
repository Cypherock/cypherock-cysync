import { createDb, createKeyValueStore } from '@cypherock/database';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';
import path from 'path';
import { config } from './config';

let db: IDatabase | undefined;

let keyDb: IKeyValueStore | undefined;

export async function initializeAndGetDb() {
  if (!db) {
    db = await createDb(
      path.join(config.USER_DATA_PATH, 'cysync-data/'),
      'uhRE19Aq',
    );
  }

  if (!keyDb) {
    keyDb = await createKeyValueStore(
      path.join(config.USER_DATA_PATH, 'cysync-data/'),
    );
  }

  return { db, keyDb };
}
