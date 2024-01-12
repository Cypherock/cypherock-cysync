import { IDatabase } from '@cypherock/db-interfaces';
import logger from '../../utils/logger';

import { migrationItems } from './items';

export const runMigrations = async (db: IDatabase) => {
  for (const migration of migrationItems) {
    try {
      const migrationRun = await db.migration.getOne({
        id: migration.id,
        isSuccessful: true,
      });

      if (!migrationRun) {
        logger.info(`Running migration: ${migration.id}`);
        await migration.up(db);
        logger.info(`Finished running migration: ${migration.id}`);
        await db.migration.insert({
          id: migration.id,
          isSuccessful: true,
          ranAt: Date.now(),
        });
      }
    } catch (error) {
      await db.migration.insert({
        id: migration.id,
        isSuccessful: false,
        ranAt: Date.now(),
      });
      logger.warn(`Failed to run migration: ${migration.id}`);
      logger.warn(error);
    }
  }
};
