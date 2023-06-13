import { Database } from './database';
import { KeyValueStore } from './keyValueStore';

export const createDb = async (dirPath: string) => Database.create(dirPath);

export const createKeyValueStore = async (dirPath: string) =>
  KeyValueStore.create(dirPath);

export { updateLogger } from './utils/logger';
