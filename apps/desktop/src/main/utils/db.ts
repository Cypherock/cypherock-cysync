import fs from 'fs';
import path from 'path';

import { createDb, createKeyValueStore } from '@cypherock/database';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';

import { config } from './config';
import { logger } from './logger';

import channelMigrations from '../../migrations/channel.json';

let db: IDatabase | undefined;

let keyDb: IKeyValueStore | undefined;

export const migrateDbBetweenChannels = async () => {
  for (const migrationItem of channelMigrations) {
    if (config.CHANNEL !== migrationItem.to) continue;

    const fromDbPath = path.join(
      config.USER_DATA_PATH,
      '..',
      `cypherock-cysync-${migrationItem.from}`,
      'cysync-data',
    );
    const toDbPath = path.join(config.USER_DATA_PATH, 'cysync-data');

    if (fs.existsSync(fromDbPath)) {
      if (fs.existsSync(toDbPath)) {
        logger.info('DB already exists, skipping migration');
        return;
      }

      logger.info(
        `Migrating DB from ${migrationItem.from} to ${migrationItem.to}`,
      );
      await fs.promises.cp(fromDbPath, toDbPath, { recursive: true });
    }
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

export const closeDbConnection = async () => {
  if (db) {
    await db.close();
  }

  if (keyDb) {
    await keyDb.close();
  }
};

export const clearDatabase = async () => {
  if (db) {
    await db.clear();
  }
  if (keyDb) {
    await keyDb.clear();
  }
};
