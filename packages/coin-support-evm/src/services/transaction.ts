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
    transaction: transaction.substring(2),
    network: evmCoinList[assetId].network,
  });

  assert(
    response.data.transaction.hash,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data.transaction.hash;
};

export const getGasPrice = async (assetId: string) => {
  // provides currect gasPrice
  const url = `${baseURL}/fees`;
  const response = await axios.post(url, {
    network: evmCoinList[assetId].network,
    responseType: 'v2',
  });

  const { fees } = response.data;
  return new BigNumber(fees).toString(10);
};

export const getGasLimit = async (assetId: string, address: string) => {
  const url = `${baseURL}/estimate-gas`;
  const response = await axios.post(url, {
    from: address,
    to: address,
    value: '0',
    data: '0x',
    network: evmCoinList[assetId].network,
    responseType: 'v2',
  });

  const { fees } = response.data;
  return new BigNumber(fees).toString(10);
};
