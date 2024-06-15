import { BigNumber, makePostRequest } from '@cypherock/cysync-utils';
import { ISignedTransaction } from '@cypherock/sdk-app-tron';

import logger from '../../utils/logger';

export * from './types';

export const getBalance = async (
  address: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _assetId: string,
): Promise<string> => {
  const url = `https://api.trongrid.io/wallet/getaccount`;
  const response = await makePostRequest(url, {
    address,
    visible: true,
  });

  return (response.data.balance ?? '0').toString();
};

export const getTransactionCount = async (
  address: string,
  assetId: string,
): Promise<number> => {
  logger.warn('Get Transaction Count Not Implemented', { address, assetId });
  return Promise.resolve(0);
};

export const broadcastTransactionToBlockchain = async (
  transaction: ISignedTransaction,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _assetId: string,
): Promise<string> => {
  const url = `https://api.trongrid.io/wallet/broadcasttransaction`;
  await makePostRequest(url, transaction);

  return transaction.txID;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAverageEnergyPrice = async (_assetId: string) => {
  const url = `https://api.trongrid.io/jsonrpc`;
  const response = await makePostRequest(url, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_gasPrice',
    params: [],
  });

  const fees = response.data?.result;
  return new BigNumber(fees).toString(10);
};

export const getAccountResources = async (
  address: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _assetId: string,
): Promise<{
  freeNetUsed?: number;
  freeNetLimit?: number;
  NetUsed?: number;
  NetLimit?: number;
  TotalNetLimit?: number;
  TotalNetWeight?: number;
  totalTronPowerWeight?: number;
  tronPowerLimit?: number;
  tronPowerUsed?: number;
  EnergyUsed?: number;
  EnergyLimit?: number;
  TotalEnergyLimit?: number;
  TotalEnergyWeight?: number;
  assetNetUsed?: number;
  assetNetLimit?: number;
}> => {
  const url = `https://api.trongrid.io/wallet/getaccountresource`;
  const response = await makePostRequest(url, {
    address,
    visible: true,
  });

  return response.data;
};
