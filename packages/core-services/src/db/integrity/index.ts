import { IDatabase } from '@cypherock/db-interfaces';

import { checkAccountIntegrity } from './account';

import logger from '../../utils/logger';

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
