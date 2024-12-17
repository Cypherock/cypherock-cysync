import { starknetCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import {
  IStarknetTransactionParams,
  IStarknetTransactionHistoryResult,
} from './types';

import { config } from '../../config';

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
