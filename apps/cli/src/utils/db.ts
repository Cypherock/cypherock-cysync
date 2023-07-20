import { setDBVersions } from '@cypherock/cysync-core-services';
import { createDb, createKeyValueStore } from '@cypherock/database';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';

let db: IDatabase | undefined;

let keyDb: IKeyValueStore | undefined;

export const initializeAndGetDb = async (dbPath: string) => {
  if (!db) {
    db = await createDb(dbPath);
    setDBVersions(db);
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
