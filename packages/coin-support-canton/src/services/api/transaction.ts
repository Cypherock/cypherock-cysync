// import { cantonCoinList } from '@cypherock/coins';
import { makePostRequest, assert } from '@cypherock/cysync-utils';

import {
  ICantonPendingResponseTransaction,
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

  const response = await makePostRequest(url, query);

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

  const response = await makePostRequest(url, query);

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
  senderPartyId: string,
  receiverPartyId: string,
  amount: string,
  memo?: string,
  expiryDate?: string,
): Promise<any> => {
  const url = `${baseURL}/prepare/send`;
  const response = await makePostRequest(url, {
    senderPartyId,
    receiverPartyId,
    amount,
    memo,
    expiryDate,
  });

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
): Promise<any> => {
  const url = `${baseURL}/prepare/${choice.toLowerCase()}`;
  const response = await makePostRequest(url, {
    partyId,
    transferContractId,
  });

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
  preparedTransaction: any,
): Promise<any> => {
  const url = `${baseURL}/broadcast`;
  const response = await makePostRequest(url, {
    signature,
    publicKey,
    preparedTransaction,
  });

  assert(
    !response.data.error,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data;
};
