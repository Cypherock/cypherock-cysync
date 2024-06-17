import { config } from '../../config';
import {
  TronAccountTransactionsApiResponse,
  TronAccountTransactionsApiResponseWithErrorSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}`;

export const getAccountsTransactionsByAddress = async (
  address: string,
  fingerprint?: string,
  perPageTxnLimit = 100,
): Promise<TronAccountTransactionsApiResponse> => {
  const url = `${baseURL}/accounts/${address}/transactions?${
    fingerprint !== undefined
      ? `fingerprint?=${fingerprint}`
      : `limit=${perPageTxnLimit}&order_by=block_timestamp%2Casc`
  }`;

  const options = { method: 'GET', headers: { accept: 'application/json' } };

  const rawResult = await fetch(url, options).then(response => response.json());

  const result =
    TronAccountTransactionsApiResponseWithErrorSchema.safeParse(rawResult);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  if (!result.data.success) {
    throw new Error(result.data.error);
  }

  return result.data;
};

export const getTransactionCount = async (address: string): Promise<number> => {
  const { data: transactions } = await getAccountsTransactionsByAddress(
    address,
  );
  return transactions.length > 0 ? 1 : 0;
};
