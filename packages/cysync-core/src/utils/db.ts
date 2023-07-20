import { setDBVersions } from '@cypherock/cysync-core-services';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';

let db: IDatabase | undefined;
let keyDb: IKeyValueStore | undefined;

export const getDB = () => {
  if (!db) {
    throw new Error('Database has not been defined');
  }

  return db;
};

export const getKeyDB = () => {
  if (!keyDb) {
    throw new Error('KeyValue Database has not been defined');
  }

  return keyDb;
};

export const setDB = (newDB: IDatabase) => {
  setDBVersions(newDB);
  db = newDB;
};

export const setKeyDB = (newDB: IKeyValueStore) => {
  keyDb = newDB;
};
