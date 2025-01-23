import { solanaCoinList } from '@cypherock/coins';
import { assert, makePostRequest } from '@cypherock/cysync-utils';

import { ISolanaTransactionResult } from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/solana/transaction`;

/**
 * Token Account Data Length can be calculated from its structure mentioned here:
 * https://github.com/solana-labs/solana-program-library/blob/08d9999f997a8bf38719679be9d572f119d0d960/token/program/src/state.rs#L86-L106
 *
 * Also, the size 165 is used to filter token accounts here:
 * https://spl.solana.com/token#finding-all-token-accounts-for-a-specific-mint
 */
const TOKEN_ACCOUNT_DATA_LENGTH = 165;

export const getTransactions = async (params: {
  address: string;
  assetId: string;
  from?: string;
  before?: string;
  limit?: number;
}): Promise<ISolanaTransactionResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
    responseType: 'v2',
    network: solanaCoinList[params.assetId].network,
  };
  delete query.assetId;

  const response = await makePostRequest(url, query);

  assert(
    typeof response.data.data === 'object',
    'Invalid transaction response from server',
  );

  return response.data;
};

export const getFees = async (message: string, assetId: string) => {
  const url = `${baseURL}/fees`;

  const query: Record<string, any> = {
    responseType: 'v2',
    network: solanaCoinList[assetId].network,
    message,
  };

  const response = await makePostRequest(url, query);

  let fees = response.data?.fees ?? '0';

  if (typeof fees === 'number') fees = fees.toString();

  if (typeof fees !== 'string')
    throw new Error('Invalid solana fees returned from server');

  return fees;
};

export const getSimulationComputeUnits = async (
  transaction: string,
  assetId: string,
): Promise<number> => {
  const url = `${baseURL}/simulation-compute-units`;

  const query: Record<string, string> = {
    transaction,
    responseType: 'v2',
    network: solanaCoinList[assetId].network,
  };

  const response = await makePostRequest(url, query);

  const units = response.data?.units ?? 0;

  if (typeof units !== 'number')
    throw new Error(
      'Invalid solana simulation compute units returned from server',
    );

  return units;
};

export const getPriorityFees = async (
  assetId: string,
  addresses?: string[],
): Promise<number> => {
  const url = `${baseURL}/priority-fees`;

  const query: Record<string, any> = {
    addresses,
    responseType: 'v2',
    network: solanaCoinList[assetId].network,
  };

  const response = await makePostRequest(url, query);

  const priorityFees = response.data?.priorityFee ?? 0;

  if (typeof priorityFees !== 'number')
    throw new Error('Invalid solana priorityFees returned from server');

  return priorityFees;
};

export const getTokenAccountRentExemptFees = async (assetId: string) => {
  const url = `${baseURL}/rent-exempt-fee`;

  const query: Record<string, any> = {
    responseType: 'v2',
    network: solanaCoinList[assetId].network,
    accountDataLength: TOKEN_ACCOUNT_DATA_LENGTH,
  };

  const response = await makePostRequest(url, query);

  let rentExemptFees = response.data?.rentExemptFee ?? '0';

  if (typeof rentExemptFees === 'number')
    rentExemptFees = rentExemptFees.toString();

  if (typeof rentExemptFees !== 'string')
    throw new Error('Invalid solana rentExemptFees returned from server');

  return rentExemptFees;
};

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  assetId: string,
): Promise<string> => {
  const url = `${baseURL}/broadcast`;
  const response = await makePostRequest(
    url,
    {
      transaction,
      network: solanaCoinList[assetId].network,
    },
    {
      maxTries: 0,
    },
  );

  assert(
    response.data.signature,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data.signature;
};
