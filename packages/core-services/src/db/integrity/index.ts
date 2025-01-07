import { IDatabase } from '@cypherock/db-interfaces';

import logger from '../../utils/logger';
import { checkAccountIntegrity } from './account';

export const checkIntegrity = async (db: IDatabase) => {
  logger.info('Checking Database integrity...');

  try {
    await checkAccountIntegrity(db);
  } catch (error) {
    logger.error('Error occured during integrity check');
    logger.error(JSON.stringify(error));
  }

  logger.info('Integrity check finished');
};
