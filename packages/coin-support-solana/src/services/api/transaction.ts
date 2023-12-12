import { solanaCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import { ISolanaTransactionResult } from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/solana/transaction`;

export const getTransactions = async (params: {
  address: string;
  assetId: string;
  from?: string;
  before?: string;
  limit?: number;
}): Promise<ISolanaTransactionResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
    responseType: 'v2',
    network: solanaCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await makePostRequest(url, query);

  assert(
    typeof response.data.data === 'object',
    'Invalid transaction response from server',
  );

  return response.data;
};

export const getFees = async (params: { assetId: string }) => {
  const url = `${baseURL}/fees`;

  const query: Record<string, any> = {
    responseType: 'v2',
    network: solanaCoinList[params.assetId].network,
  };

  const response = await makePostRequest(url, query);

  let fees = response.data?.fees ?? '0';

  if (typeof fees === 'number') fees = fees.toString();

  if (typeof fees !== 'string')
    throw new Error('Invalid solana fees returned from server');

  return fees;
};

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  assetId: string,
): Promise<string> => {
  const url = `${baseURL}/broadcast`;
  const response = await makePostRequest(url, {
    transaction,
    network: solanaCoinList[assetId].network,
  });

  assert(
    response.data.signature,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data.signature;
};
