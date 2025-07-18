import fs from 'fs';
import path from 'path';

import { createDb, createKeyValueStore } from '@cypherock/database';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';

import { config } from './config';
import { logger } from './logger';

import channelMigrations from '../../migrations/channel.json';

let db: IDatabase | undefined;

let keyDb: IKeyValueStore | undefined;

const DB_PATH =
  config.VENDOR === 'default' ? 'cysync-data' : `${config.VENDOR}-data`;
const packageJsonPath = path.resolve(__dirname, '../../../package.json');
const { productName: APP_NAME } = JSON.parse(
  fs.readFileSync(packageJsonPath, 'utf-8'),
);

export const migrateDbBetweenChannels = async () => {
  for (const migrationItem of channelMigrations) {
    if (config.CHANNEL !== migrationItem.to) continue;

    const fromDbPath = path.join(
      config.USER_DATA_PATH,
      '..',
      `${APP_NAME}-${migrationItem.from}`,
      DB_PATH,
    );
    const toDbPath = path.join(config.USER_DATA_PATH, DB_PATH);

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
  const dbPath = path.join(config.USER_DATA_PATH, `${DB_PATH}/`);

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
  try {
    if (db) {
      await db.clear();
    }
    if (keyDb) {
      await keyDb.clear();
    }

    const dbPath = path.join(config.USER_DATA_PATH, `${DB_PATH}/`);

    await fs.promises.rm(dbPath, { recursive: true, force: true });
  } catch (error) {
    logger.warn('Error while clearing database');
    logger.warn(error);
  }
};
