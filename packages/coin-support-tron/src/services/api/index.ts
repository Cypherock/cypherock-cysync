import { ISignedTransaction } from '@cypherock/sdk-app-tron';

import logger from '../../utils/logger';

export * from './types';

export const getBalance = async (
  address: string,
  assetId: string,
): Promise<string> => {
  logger.warn('Get Balance Not Implemented', { address, assetId });
  return '0';
};

export const getTransactionCount = async (
  address: string,
  assetId: string,
): Promise<number> => {
  logger.warn('Get Transaction Count Not Implemented', { address, assetId });
  return Promise.resolve(0);
};

export const broadcastTransactionToBlockchain = async (
  transaction: ISignedTransaction,
  assetId: string,
): Promise<string> => {
  logger.warn('Broadcast Transaction Not Implemented', {
    transaction,
    assetId,
  });
  return Promise.resolve('hash');
};
