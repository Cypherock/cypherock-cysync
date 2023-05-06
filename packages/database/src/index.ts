import { initializeDb } from './database';
import { AppDataSource } from './data-source';

export const createDb = () => initializeDb(AppDataSource);
