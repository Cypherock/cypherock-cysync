// import { cantonCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

import { ICantonTransactionParams, ICantonTransactionResult } from './types';

// import { config } from '../../config';

// const baseURL = `${config.API_CYPHEROCK}/canton/transaction`;

export const getTransactions = async (
  params: ICantonTransactionParams,
): Promise<ICantonTransactionResult> => {
  console.log(`Getting transactions with params: ${params}`);
  // const url = `${baseURL}/history`;

  // const query: Record<string, any> = {
  //   ...params,
  //   network: cantonCoinList[params.assetId].network,
  // };
  // delete query.assetId;

  // const response = await makePostRequest(url, query);

  // assert(
  //   typeof response.data.transactions === 'object',
  //   'Invalid transaction response from server',
  // );

  return { transactions: [], hasMore: false, limit: 20 };
};

export const getFees = async (assetId: string) => {
  console.log(`Getting fees for ${assetId}`);
  // const url = `${baseURL}/fees`;

  // const query: Record<string, any> = {
  //   network: cantonCoinList[assetId].network,
  // };

  // const response = await makePostRequest(url, query);

  // let fees = response.data?.fees?.minimum_fee ?? '10';

  // if (typeof fees === 'number') fees = fees.toString();

  // if (typeof fees !== 'string')
  //   throw new Error('Invalid canton fees returned from server');

  return '0';
};

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  assetId: string,
): Promise<any> => {
  console.log(`Broadcasting transaction for ${assetId} with ${transaction}`);
  // const url = `${baseURL}/broadcast`;
  // const response = await makePostRequest(
  //   url,
  //   {
  //     transaction,
  //     network: cantonCoinList[assetId].network,
  //   },
  //   {
  //     maxTries: 0,
  //   },
  // );

  // assert(
  //   !response.data.error,
  //   new Error('Server: Invalid txn hash from server'),
  // );

  // return response.data;
  assert(null, new Error('Broadcast api not integrated'));
};
