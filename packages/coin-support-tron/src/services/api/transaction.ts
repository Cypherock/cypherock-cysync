import { BigNumber, makePostRequest } from '@cypherock/cysync-utils';
import { ISignedTransaction } from '@cypherock/sdk-app-tron';

import { config } from '../../config';
import {
  TronTransactionsApiResponse,
  TronTransactionsApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}/tron/transaction`;

export const getAccountsTransactionsByAddress = async (params: {
  address: string;
  page?: number;
  pageSize?: number;
  from?: number;
  to?: number;
}): Promise<Required<TronTransactionsApiResponse>> => {
  const url = `${baseURL}/history`;

  const response = await makePostRequest(url, params);

  const result = TronTransactionsApiResponseSchema.safeParse(response.data);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  return {
    transactions: [],
    nonTokenTxs: 0,
    tokens: [],
    ...result.data,
  };
};

export const broadcastTransactionToBlockchain = async (
  transaction: ISignedTransaction,
): Promise<string> => {
  const url = `${baseURL}/broadcast`;

  const response = await makePostRequest(url, { transaction });

  return response.data.txid;
};

export const getAverageEnergyPrice = async () => {
  const url = `${baseURL}/energy-price`;

  const response = await makePostRequest(url);

  const fees = response.data?.result;
  return new BigNumber(fees).toString(10);
};
