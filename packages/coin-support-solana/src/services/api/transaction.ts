import { solanaCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import { ISolanaTransactionResult } from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/solana/transaction`;

export const getTransactions = async (params: {
  address: string;
  assetId: string;
  from?: number;
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
