import { stellarCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import {
  IStellarTransactionParams,
  IStellarTransactionHistoryResponse,
} from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/stellar/transaction`;

export const getTransactions = async (
  params: IStellarTransactionParams,
): Promise<IStellarTransactionHistoryResponse> => {
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

  let { baseFee = '100', recommendedFee = '100' } = response.data?.fees ?? {};

  if (typeof baseFee === 'number') baseFee = baseFee.toString();
  if (typeof recommendedFee === 'number')
    recommendedFee = recommendedFee.toString();

  if (typeof baseFee !== 'string')
    throw new Error('Invalid stellar baseFee returned from server');

  if (typeof recommendedFee !== 'string')
    throw new Error('Invalid stellar recommendedFee returned from server');

  return { baseFee, recommendedFee };
};

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
    !response.data.error || response.data.hash,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data;
};
