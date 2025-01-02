import { starknetCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import {
  IStarknetTransactionParams,
  IStarknetTransactionHistoryResult,
} from './types';

import { config } from '../../config';
import {
  FeeData,
  StarknetDeployAccountTransaction,
  StarknetInvokeTransaction,
  StarknetTransaction,
} from '../transaction';

const baseURL = `${config.API_CYPHEROCK}/starknet/transaction`;

export const getTransactions = async (
  params: IStarknetTransactionParams,
): Promise<IStarknetTransactionHistoryResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
    network: starknetCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await makePostRequest(url, query);

  assert(
    response.data.transactions !== undefined,
    'Invalid transaction response from server',
  );

  return response.data;
};

export const getTransactionDeploymentInfo = async (
  address: string,
  assetId: string,
  contractAddress?: string,
): Promise<{
  hasTransactions: boolean;
  isAccountDeployed: boolean;
}> => {
  const url = `${baseURL}/transactionDeploymentInfo`;

  const query: Record<string, any> = {
    address,
    network: starknetCoinList[assetId].network,
    contractAddress,
  };

  const response = await makePostRequest(url, query);

  return response.data;
};

export const getTransactionCount = async (
  address: string,
  assetId: string,
  contractAddress?: string,
): Promise<number> => {
  const { hasTransactions } = await getTransactionDeploymentInfo(
    address,
    assetId,
    contractAddress,
  );
  return hasTransactions ? 1 : 0;
};

export const getIsAccountDeployed = async (
  address: string,
  assetId: string,
): Promise<boolean> => {
  const { isAccountDeployed } = await getTransactionDeploymentInfo(
    address,
    assetId,
  );
  return isAccountDeployed;
};

export const estimateFees = async (params: {
  transaction: StarknetTransaction;
  assetId: string;
}): Promise<FeeData> => {
  const url = `${baseURL}/estimateFees`;

  const query: Record<string, any> = {
    transaction: params.transaction,
    network: starknetCoinList[params.assetId].network,
  };

  const response = await makePostRequest(url, query);

  return response.data;
};

export const broadcastInvokeTransactionToBlockchain = async (params: {
  transaction: StarknetInvokeTransaction;
  assetId: string;
}): Promise<{ transactionHash: string }> => {
  const url = `${baseURL}/broadcastInvoke`;

  const query: Record<string, any> = {
    transaction: params.transaction,
    network: starknetCoinList[params.assetId].network,
  };

  const response = await makePostRequest(url, query);

  assert(
    response.data.result !== undefined,
    'Invalid transaction broadcast response from server',
  );

  return response.data.result;
};

export const broadcastDeployAccountTransactionToBlockchain = async (params: {
  transaction: StarknetDeployAccountTransaction;
  assetId: string;
}): Promise<{ transactionHash: string }> => {
  const url = `${baseURL}/broadcastDeployAccount`;

  const query: Record<string, any> = {
    transaction: params.transaction,
    network: starknetCoinList[params.assetId].network,
  };

  const response = await makePostRequest(url, query);

  assert(
    response.data.result !== undefined,
    'Invalid deploy account transaction broadcast response from server',
  );

  return response.data.result;
};
