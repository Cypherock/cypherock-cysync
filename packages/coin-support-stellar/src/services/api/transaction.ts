import { stellarCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import { IStellarTransactionParams, IStellarTransactionResult } from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/stellar/transaction`;

export const getTransactions = async (
  params: IStellarTransactionParams,
): Promise<IStellarTransactionResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
    network: stellarCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await makePostRequest(url, query);

  assert(
    typeof response.data.transactions === 'object',
    'Invalid transaction response from server',
  );

  return response.data;
};

export const getFees = async (assetId: string) => {
  const url = `${baseURL}/fees`;

  const query: Record<string, any> = {
    network: stellarCoinList[assetId].network,
  };

  const response = await makePostRequest(url, query);

  let fees = response.data?.fees?.minimum_fee ?? '100';

  if (typeof fees === 'number') fees = fees.toString();

  if (typeof fees !== 'string')
    throw new Error('Invalid stellar fees returned from server');

  return fees;
};

export const getTimeBounds = async () => ({
  minTime: 0,
  maxTime: 0,
});

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  assetId: string,
): Promise<any> => {
  const url = `${baseURL}/broadcast`;
  const response = await makePostRequest(
    url,
    {
      transaction,
      network: stellarCoinList[assetId].network,
    },
    {
      maxTries: 0,
    },
  );

  assert(
    !response.data.error,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data;
};
