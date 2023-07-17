import { evmCoinList } from '@cypherock/coins';
import axios from 'axios';

import { config } from '../config';

const baseURL = `${config.API_CYPHEROCK}/eth`;

export const getBalance = async (address: string, assetId: string) => {
  const url = `${baseURL}/wallet/balance`;
  const response = await axios.post(url, {
    address,
    network: evmCoinList[assetId].network,
    responseType: 'v2',
  });

  const { balance } = response.data;
  if (typeof balance !== 'string') {
    throw new Error('Invalid evm balance returned from server');
  }

  return balance;
};

export const getTransactionCount = async (address: string, assetId: string) => {
  const url = `${baseURL}/wallet/txn-count`;
  const response = await axios.post(url, {
    address,
    network: evmCoinList[assetId].network,
    responseType: 'v2',
  });

  const { count } = response.data;
  if (typeof count !== 'number') {
    throw new Error('Invalid evm txn count returned from server');
  }

  return count;
};
