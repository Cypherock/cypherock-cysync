import { IDatabase } from '@cypherock/db-interfaces';

let db: IDatabase | undefined;

export const getDB = () => {
  if (!db) {
    throw new Error('Database has not been defined');
  }

  return db;
};

export const setDB = (newDB: IDatabase) => {
  db = newDB;
};
