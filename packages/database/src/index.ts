import Database from 'better-sqlite3';
import { initializeDb } from './database';

const db = new Database('database.sqlite', { verbose: console.log });
db.pragma('journal_mode = WAL');

export const createDb = () => initializeDb(db);
