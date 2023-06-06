import { createDb } from '@cypherock/database';
import { IDatabase } from '@cypherock/db-interfaces';
import path from 'path';
import { config } from './config';

let db: IDatabase | undefined;

export async function initializeAndGetDb() {
  if (db) return db;

  db = await createDb(path.join(config.USER_DATA_PATH, 'cysync-data/'));

  return db;
}
