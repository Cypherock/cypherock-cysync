import { evmCoinList } from '@cypherock/coins';
import { BigNumber, assert } from '@cypherock/cysync-utils';
import axios from 'axios';

import { config } from '../config';

const baseURL = `${config.API_CYPHEROCK}/eth/transaction`;

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

export const estimateGasLimit = async (
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

  const { fees } = response.data;
  return new BigNumber(fees).toString(10);
};
