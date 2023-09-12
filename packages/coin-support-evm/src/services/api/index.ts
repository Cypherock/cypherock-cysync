import { evmCoinList } from '@cypherock/coins';
import axios from 'axios';

import { IEvmContractTransactionResult, IEvmTransactionResult } from './types';

import { config } from '../../config';

export * from './types';

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

export const getTransactions = async (params: {
  address: string;
  assetId: string;
  contractAddress?: string;
  from?: number;
  limit?: number;
  internal?: boolean;
}): Promise<IEvmTransactionResult> => {
  const url = `${baseURL}/transaction/history`;

  const query: Record<string, any> = {
    ...params,
    responseType: 'v2',
    network: evmCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await axios.post(url, query);

  return response.data;
};

export const getContractTransactions = async (params: {
  address: string;
  assetId: string;
  contractAddress?: string;
  from?: number;
  limit?: number;
}): Promise<IEvmContractTransactionResult> => {
  const url = `${baseURL}/transaction/contract-history`;

  const query: Record<string, any> = {
    ...params,
    responseType: 'v2',
    network: evmCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await axios.post(url, query);

  return response.data;
};
