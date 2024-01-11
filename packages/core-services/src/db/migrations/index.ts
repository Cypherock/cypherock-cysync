import { IDatabase } from '@cypherock/db-interfaces';

import { migrationItems } from './items';

export const runMigrations = async (db: IDatabase) => {
  for (const migration of migrationItems) {
    await migration.up(db);
  }
};
