import { config } from '../../config';
import {
  TronTransactionsApiResponse,
  TronTransactionsApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}`;

export const getAccountsTransactionsByAddress = async (
  address: string,
  page: number,
  pageSize: number,
): Promise<Required<TronTransactionsApiResponse>> => {
  const url = `${baseURL}/address/${address}?page=${page}&pageSize=${pageSize}&details=txs`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'api-key': config.NOW_NODES_API_KEY,
    },
  };

  const rawResult = await fetch(url, options).then(response => response.json());

  const result = TronTransactionsApiResponseSchema.safeParse(rawResult);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  return {
    transactions: [],
    nonTokenTxs: 0,
    tokens: [],
    ...result.data,
  };
};

export const getTransactionCount = async (address: string): Promise<number> => {
  const { txs } = await getAccountsTransactionsByAddress(address, 1, 1);
  return txs;
};
