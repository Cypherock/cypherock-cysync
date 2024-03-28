import { nearCoinList } from '@cypherock/coins';
import axios from 'axios';

import { config } from '../config';

const baseURL = `${config.API_CYPHEROCK}/v2/near`;

export const getBalance = async (
  address: string,
  assetId: string,
): Promise<{
  balance: string;
  nativeBalance: string;
  reservedStorage: string;
}> => {
  const url = `${baseURL}/wallet/balance`;
  const response = await axios.post(url, {
    address,
    network: nearCoinList[assetId].network,
    responseType: 'v2',
  });

  const { balance, nativeBalance, reservedStorage } = response.data;

  return {
    balance: balance ?? '0',
    nativeBalance: nativeBalance ?? '0',
    reservedStorage: reservedStorage ?? '0',
  };
};

interface GetTransactionsParams {
  address: string;
  assetId: string;
  page: number;
  perPage: number;
  order: 'desc' | 'asc';
}

export const getTransactions = async ({
  address,
  assetId,
  page,
  perPage,
  order,
}: GetTransactionsParams) => {
  const url = `${baseURL}/transaction/history`;
  const response = await axios.post(url, {
    address,
    network: nearCoinList[assetId].network,
    responseType: 'v2',
    page,
    perPage,
    order,
  });

  const hasMore = response.data.length === perPage;

  return {
    transactions: response.data,
    hasMore,
  };
};

export const getTransactionCount = async (address: string, assetId: string) => {
  const { transactions } = await getTransactions({
    address,
    assetId,
    page: 1,
    perPage: 1,
    order: 'asc',
  });

  const isUsed = transactions && transactions.length > 0;

  return isUsed ? 1 : 0;
};
