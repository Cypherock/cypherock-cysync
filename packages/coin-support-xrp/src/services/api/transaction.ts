import { assert, makePostRequest } from '@cypherock/cysync-utils';
import { config } from '../../config';
import { xrpCoinList } from '@cypherock/coins';
import { IXrpTransactionParams, IXrpTransactionResult } from './types';

const baseURL = `${config.API_CYPHEROCK}/xrp/transaction`;

export const getTransactions = async (
  params: IXrpTransactionParams,
): Promise<IXrpTransactionResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
    network: xrpCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await makePostRequest(url, query);

  assert(
    typeof response.data.transactions === 'object',
    'Invalid transaction response from server',
  );

  return response.data;
};
