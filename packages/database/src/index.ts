import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { Database as DB } from './database';
import logger from './utils/logger';

export const createDb = (dirPath: string) => {
  let dbPath = path.join(dirPath, 'db.sqlite');
  let storagePath = path.join(dirPath, 'storage.sqlite');

  if (dirPath === ':memory:') {
    dbPath = dirPath;
    storagePath = dirPath;
  } else if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const db = new Database(dbPath, {
    verbose: logger.verbose as any,
  });
  db.pragma('journal_mode = WAL');

  const storageDb = new Database(storagePath, {
    verbose: logger.verbose as any,
  });
  storageDb.pragma('journal_mode = WAL');
  return new DB(db, storageDb);
};

export { updateLogger } from './utils/logger';
