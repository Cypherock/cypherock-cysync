import { evmCoinList } from '@cypherock/coins';
import axios from 'axios';

import { config } from '../../config';

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

export interface IEvmTransactionItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName?: string;
}

export interface IEvmTransactionResult {
  result: IEvmTransactionItem[];
  more: boolean;
}

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
