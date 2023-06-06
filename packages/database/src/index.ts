import { Database } from './database';

export const createDb = async (dirPath: string) => Database.create(dirPath);

export { updateLogger } from './utils/logger';
