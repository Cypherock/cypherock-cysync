import { nearCoinList } from '@cypherock/coins';
import axios from 'axios';

import { config } from '../config';

const baseURL = `${config.API_CYPHEROCK}/near`;

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

export const getTransactions = async (
  address: string,
  assetId: string,
  from?: number,
  limit?: number,
) => {
  const url = `${baseURL}/transaction/history`;
  const response = await axios.post(url, {
    address,
    network: nearCoinList[assetId].network,
    responseType: 'v2',
    limit,
    from,
  });

  return {
    transactions: response.data.data,
    hasMore: response.data.more,
  };
};

export const getTransactionCount = async (address: string, assetId: string) => {
  const { transactions } = await getTransactions(
    address,
    assetId,
    undefined,
    1,
  );

  const isUsed = transactions && transactions.length > 0;

  return isUsed ? 1 : 0;
};
