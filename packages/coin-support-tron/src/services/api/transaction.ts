import { config } from '../../config';
import {
  TronAccountTransactionsApiResponseSchema,
  TronTransactions,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}`;

export const getAccountsTransactionsByAddress = async (
  address: string,
  fingerprint?: string,
): Promise<TronTransactions> => {
  const url = `${baseURL}/accounts/${address}/transactions?${
    fingerprint !== undefined
      ? `fingerprint?=${fingerprint}`
      : `limit=100&order_by=block_timestamp%2Casc`
  }`;

  const options = { method: 'GET', headers: { accept: 'application/json' } };

  const rawResult = await fetch(url, options).then(response => response.json());

  const result = TronAccountTransactionsApiResponseSchema.safeParse(rawResult);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  if (!result.data.success) {
    throw new Error(result.data.error);
  }

  return result.data.data;
};

export const getTransactionCount = async (address: string): Promise<number> => {
  const transactions = await getAccountsTransactionsByAddress(address);
  return transactions.length > 0 ? 1 : 0;
};
