// import { cantonCoinList } from '@cypherock/coins';
import { makePostRequest, assert } from '@cypherock/cysync-utils';

import { getRequestOptions } from './common';
import {
  ICantonPendingResponseTransaction,
  ICantonPrepareExternalPartyTxnResult,
  ICantonTransactionParams,
  ICantonTransactionResult,
} from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/canton/transaction`;

export const getTransactions = async (
  params: ICantonTransactionParams,
): Promise<ICantonTransactionResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
  };
  delete query.assetId;
  delete query.accessToken;

  const response = await makePostRequest(
    url,
    query,
    getRequestOptions(params.accessToken),
  );

  assert(
    typeof response.data?.transactions === 'object',
    'Invalid transaction response from server',
  );

  return response.data;
};

export const getPendingTransactions = async (
  params: ICantonTransactionParams,
): Promise<ICantonPendingResponseTransaction[]> => {
  const url = `${baseURL}/history/pending`;
  const query: Record<string, any> = {
    ...params,
  };
  delete query.assetId;
  delete query.nextOffset;
  delete query.accessToken;

  const response = await makePostRequest(
    url,
    query,
    getRequestOptions(params.accessToken),
  );

  assert(
    typeof response.data?.transactions === 'object',
    'Invalid transaction response from server',
  );

  return response.data.transactions;
};

export const getFees = async (assetId: string) => {
  console.log(`Getting fees for ${assetId}`);
  // const url = `${baseURL}/fees`;

  // const query: Record<string, any> = {
  //   network: cantonCoinList[assetId].network,
  // };

  // const response = await makePostRequest(url, query);

  // let fees = response.data?.fees?.minimum_fee ?? '10';

  // if (typeof fees === 'number') fees = fees.toString();

  // if (typeof fees !== 'string')
  //   throw new Error('Invalid canton fees returned from server');

  return '0';
};

export const prepareSendTransaction = async (
  accessToken: string,
  senderPartyId: string,
  receiverPartyId: string,
  amount: string,
  memo?: string,
  expiryDate?: string,
): Promise<any> => {
  const url = `${baseURL}/prepare/send`;
  const response = await makePostRequest(
    url,
    {
      partyId: senderPartyId,
      receiverPartyId,
      amount,
      memo,
      expiryDate,
    },
    getRequestOptions(accessToken),
  );

  assert(
    !response.data.error &&
      response.data.command?.preparedTransaction &&
      response.data.commandId,
    new Error('Server: Invalid prepared transaction from server'),
  );

  return response.data;
};

export const prepareChoiceTxn = async (
  partyId: string,
  transferContractId: string,
  choice: string,
  accessToken: string,
): Promise<any> => {
  const url = `${baseURL}/prepare/${choice.toLowerCase()}`;
  const response = await makePostRequest(
    url,
    {
      partyId,
      transferContractId,
    },
    getRequestOptions(accessToken),
  );

  assert(
    !response.data.error &&
      response.data.command?.preparedTransaction &&
      response.data.commandId,
    new Error('Server: Invalid prepared transaction from server'),
  );

  return response.data;
};

export const prepareTransferPreApprovalTxn = async (
  partyId: string,
  accessToken: string,
): Promise<any> => {
  const url = `${baseURL}/prepare/transfer-preapproval`;
  const response = await makePostRequest(
    url,
    {
      partyId,
    },
    getRequestOptions(accessToken),
  );

  assert(
    !response.data.error &&
      response.data.command?.preparedTransaction &&
      response.data.commandId,
    new Error('Server: Invalid prepared transaction from server'),
  );

  return response.data;
};

export const broadcastTransactionToBlockchain = async (
  signature: string,
  publicKey: string,
  partyId: string,
  preparedTransaction: any,
  accessToken: string,
): Promise<any> => {
  const url = `${baseURL}/broadcast`;
  const response = await makePostRequest(
    url,
    {
      signature,
      publicKey,
      partyId,
      preparedTransaction,
    },
    getRequestOptions(accessToken),
  );

  assert(
    !response.data.error,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data;
};

export const prepareExternalPartyTxn = async (
  publicKey: string,
  partyId: string,
  accessToken: string,
): Promise<ICantonPrepareExternalPartyTxnResult> => {
  const url = `${baseURL}/prepare/external-party`;
  const response = await makePostRequest(
    url,
    {
      publicKey,
      partyId,
    },
    getRequestOptions(accessToken),
  );

  assert(
    !response.data.error && response.data.topologyTransactions,
    new Error('Server: Invalid prepared transaction from server'),
  );

  return response.data;
};

export const broadcastExternalPartyTransactionToBlockchain = async (
  signature: string,
  preparedParty: ICantonPrepareExternalPartyTxnResult,
  accessToken: string,
): Promise<any> => {
  const url = `${baseURL}/broadcast/external-party`;
  const response = await makePostRequest(
    url,
    {
      signature,
      preparedParty,
    },
    getRequestOptions(accessToken),
  );

  assert(
    !response.data.error,
    new Error('Server: Broadcast external party txn failed'),
  );

  return response.data;
};
