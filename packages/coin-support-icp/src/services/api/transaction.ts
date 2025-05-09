import { makePostRequest } from '@cypherock/cysync-utils';

import { IIcpTransactionHistoryResponse } from './types';

import { config } from '../../config';
import { ICP_INDEX_CANISTER_ID, ICP_LEDGER_CANISTER_ID } from '../../constants';

const baseURL = `${config.API_CYPHEROCK}/icp/transaction`;

export const getTransactionFee = async () => {
  const url = `${baseURL}/fees`;

  const response = await makePostRequest(url, {
    canisterId: ICP_LEDGER_CANISTER_ID,
  });

  let fees = response.data?.fees ?? '10000';

  if (typeof fees === 'number') fees = fees.toString();

  if (typeof fees !== 'string')
    throw new Error('Invalid icp txn fees returned from server');

  return fees;
};

export const getTransactions = async (
  accountId: string,
  limit: number,
  before?: string,
  after?: string,
): Promise<IIcpTransactionHistoryResponse> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    accountId,
    limit,
    before,
    after,
    canisterId: ICP_INDEX_CANISTER_ID,
  };

  const response = await makePostRequest(url, query);

  if (typeof response.data.transactions !== 'object') {
    throw new Error('Invalid transaction history response from server');
  }

  return response.data;
};

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  isTokenTransaction: boolean,
  canisterId: string,
): Promise<{ txnId: string }> => {
  const url = `${baseURL}/broadcast`;

  const query: Record<string, any> = {
    transaction,
    isTokenTransaction,
    canisterId,
  };

  const response = await makePostRequest(url, query);

  if (response.data.txnId === undefined) {
    throw new Error('Invalid transaction broadcast response from server');
  }

  return response.data;
};

export const getTokenTransactions = async (
  principalId: string,
  tokenIndexCanisterId: string,
  limit: number,
  before?: string,
  after?: string,
): Promise<IIcpTransactionHistoryResponse> => {
  const url = `${baseURL}/token/history`;

  const query: Record<string, any> = {
    principalId,
    limit,
    before,
    after,
    canisterId: tokenIndexCanisterId,
  };

  const response = await makePostRequest(url, query);

  if (typeof response.data.transactions !== 'object') {
    throw new Error('Invalid token transaction history response from server');
  }

  return response.data;
};

export const getTokenTransactionFee = async (canisterId: string) => {
  const url = `${baseURL}/token/fees`;

  const response = await makePostRequest(url, { canisterId });

  let fees = response.data?.fees ?? '200000';

  if (typeof fees === 'number') fees = fees.toString();

  if (typeof fees !== 'string')
    throw new Error('Invalid icp token txn fees returned from server');

  return fees;
};
