import path from 'path';
import fs from 'fs';

import { createDb, createKeyValueStore } from '@cypherock/database';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';

import { config } from './config';

let db: IDatabase | undefined;

let keyDb: IKeyValueStore | undefined;

export const migrateDbFromBeta = async () => {
  if (config.CHANNEL !== 'latest') return;

  const betaDbPath = path.join(
    config.USER_DATA_PATH,
    '..',
    'cypherock-cysync-beta',
    'cysync-data',
  );
  const currentDbPath = path.join(config.USER_DATA_PATH, 'cysync-data');

  if (fs.existsSync(betaDbPath)) {
    if (fs.existsSync(currentDbPath)) {
      console.log('DB already exists');
      return;
    }

    await fs.promises.cp(betaDbPath, currentDbPath, { recursive: true });
  }
};

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
