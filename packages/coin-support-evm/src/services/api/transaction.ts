import { evmCoinList } from '@cypherock/coins';
import { BigNumber, assert } from '@cypherock/cysync-utils';
import axios from 'axios';

import { IEvmContractTransactionResult, IEvmTransactionResult } from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/eth/transaction`;

export const getTransactions = async (params: {
  address: string;
  assetId: string;
  contractAddress?: string;
  from?: number;
  limit?: number;
  internal?: boolean;
}): Promise<IEvmTransactionResult> => {
  const url = `${baseURL}/history`;

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
  const url = `${baseURL}/contract-history`;

  const query: Record<string, any> = {
    ...params,
    responseType: 'v2',
    network: evmCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await axios.post(url, query);

  return response.data;
};

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  assetId: string,
): Promise<string> => {
  const url = `${baseURL}/broadcast`;
  const response = await axios.post(url, {
    transaction: transaction.startsWith('0x')
      ? transaction.substring(2)
      : transaction,
    network: evmCoinList[assetId].network,
  });

  assert(
    response.data.result,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data.result;
};

export const getAverageGasPrice = async (assetId: string) => {
  const url = `${baseURL}/fees`;
  const response = await axios.post(url, {
    network: evmCoinList[assetId].network,
    responseType: 'v2',
  });

  const { fees } = response.data;
  return new BigNumber(fees).toString(10);
};

export const estimateGas = async (
  assetId: string,
  params: {
    from: string;
    to: string;
    value: string;
    data: string;
  },
) => {
  const url = `${baseURL}/estimate-gas`;
  const response = await axios.post(url, {
    ...params,
    network: evmCoinList[assetId].network,
    responseType: 'v2',
  });

  const { fees, l1Cost } = response.data;
  return {
    limit: new BigNumber(fees).toString(10),
    l1Cost: new BigNumber(l1Cost).toString(10),
  };
};
