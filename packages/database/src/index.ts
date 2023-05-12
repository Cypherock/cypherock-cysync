import Database from 'better-sqlite3';
import { Database as DB } from './database';
import logger from './utils/logger';

export const createDb = (path: string) => {
  const db = new Database(path, {
    verbose: logger.verbose as any,
  });
  db.pragma('journal_mode = WAL');
  return new DB(db);
};
