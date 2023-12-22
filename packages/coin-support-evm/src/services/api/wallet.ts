import { getAsset } from '@cypherock/coin-support-utils';
import { evmCoinList, IEvmErc20Token } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/eth/wallet`;

export const getBalance = async (address: string, assetId: string) => {
  const url = `${baseURL}/balance`;
  const response = await makePostRequest(url, {
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

export const getContractBalance = async (
  address: string,
  parentAssetId: string,
  assetId: string,
) => {
  const url = `${baseURL}/balance`;
  const asset = getAsset(parentAssetId, assetId) as IEvmErc20Token;

  const response = await makePostRequest(url, {
    contractAddress: asset.address,
    address,
    network: evmCoinList[parentAssetId].network,
    responseType: 'v2',
  });

  const { balance } = response.data;
  if (typeof balance !== 'string') {
    throw new Error('Invalid evm balance returned from server');
  }

  return balance;
};

export const getTransactionCount = async (address: string, assetId: string) => {
  const url = `${baseURL}/txn-count`;
  const response = await makePostRequest(url, {
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
