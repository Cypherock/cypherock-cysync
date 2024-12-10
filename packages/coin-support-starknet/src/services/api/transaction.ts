import { starknetCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import {
  IStarknetTransactionParams,
  IStarknetTransactionResult,
} from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/starknet/transaction`;

export const getTransactions = async (
  params: IStarknetTransactionParams,
): Promise<IStarknetTransactionResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
    network: starknetCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await makePostRequest(url, query);

  assert(
    typeof response.data.tokenTransfers === 'object',
    'Invalid transaction response from server',
  );

  return response.data;
};
