import { assert } from '@cypherock/cysync-utils';
import { IKeyValueStore } from '@cypherock/db-interfaces';

import { makePostRequestWithAuthTokenConfig } from './common';
import {
  ICantonPendingResponseTransaction,
  ICantonPrepareExternalPartyTxnResult,
  ICantonPrepareSendTxnParams,
  ICantonPrepareChoiceTxnParams,
  ICantonTransactionHistoryParams,
  ICantonTransactionResult,
  ICantonBroadcastTxnParams,
  ICantonPrepareExternalPartyTxnParams,
  ICantonBroadcastExternalPartyTxnParams,
  ICantonInstrument,
} from './types';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/canton/transaction`;

export const getTransactions = async (
  params: ICantonTransactionHistoryParams,
  keyDB?: IKeyValueStore,
): Promise<ICantonTransactionResult> => {
  const url = `${baseURL}/history`;

  const query: Record<string, any> = {
    ...params,
  };

  const response = await makePostRequestWithAuthTokenConfig(url, query, keyDB);

  assert(
    typeof response.data?.transactions === 'object',
    'Invalid transaction response from server',
  );

  return response.data;
};

export const getPendingTransactions = async (
  params: ICantonTransactionHistoryParams,
  keyDB?: IKeyValueStore,
): Promise<ICantonPendingResponseTransaction[]> => {
  const url = `${baseURL}/history/pending`;
  const query: Record<string, any> = {
    ...params,
  };
  delete query.nextOffset;

  const response = await makePostRequestWithAuthTokenConfig(url, query, keyDB);

  assert(
    typeof response.data?.transactions === 'object',
    'Invalid transaction response from server',
  );

  return response.data.transactions;
};

export const prepareSendTransaction = async (
  params: ICantonPrepareSendTxnParams,
  keyDB?: IKeyValueStore,
): Promise<any> => {
  const url = `${baseURL}/prepare/send`;
  const response = await makePostRequestWithAuthTokenConfig(url, params, keyDB);

  assert(
    !response.data.error &&
      response.data.command?.preparedTransaction &&
      response.data.commandId,
    new Error('Server: Invalid prepared transaction from server'),
  );

  return response.data;
};

export const prepareChoiceTxn = async (
  choice: string,
  params: ICantonPrepareChoiceTxnParams,
  keyDB?: IKeyValueStore,
): Promise<any> => {
  const url = `${baseURL}/prepare/${choice.toLowerCase()}`;
  const response = await makePostRequestWithAuthTokenConfig(url, params, keyDB);

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
  instrument: ICantonInstrument,
  keyDB?: IKeyValueStore,
): Promise<any> => {
  const url = `${baseURL}/prepare/transfer-preapproval`;
  const data = {
    partyId,
    instrument,
  };
  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);

  assert(
    !response.data.error &&
      response.data.command?.preparedTransaction &&
      response.data.commandId,
    new Error('Server: Invalid prepared transaction from server'),
  );

  return response.data;
};

export const prepareMergeDelegationProposalTxn = async (
  partyId: string,
  keyDB?: IKeyValueStore,
): Promise<any> => {
  const url = `${baseURL}/prepare/merge-delegation-proposal`;
  const data = {
    partyId,
  };
  const response = await makePostRequestWithAuthTokenConfig(url, data, keyDB);

  assert(
    !response.data.error &&
      response.data.command?.preparedTransaction &&
      response.data.commandId,
    new Error('Server: Invalid prepared transaction from server'),
  );

  return response.data;
};

export const broadcastTransactionToBlockchain = async (
  params: ICantonBroadcastTxnParams,
  keyDB?: IKeyValueStore,
): Promise<{
  updateId: string;
  completionOffset: number;
}> => {
  const url = `${baseURL}/broadcast`;
  const response = await makePostRequestWithAuthTokenConfig(url, params, keyDB);

  assert(
    !response.data.error,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data;
};

export const prepareExternalPartyTxn = async (
  params: ICantonPrepareExternalPartyTxnParams,
  keyDB?: IKeyValueStore,
): Promise<ICantonPrepareExternalPartyTxnResult> => {
  const url = `${baseURL}/prepare/external-party`;
  const response = await makePostRequestWithAuthTokenConfig(url, params, keyDB);

  assert(
    !response.data.error && response.data.topologyTransactions,
    new Error('Server: Invalid prepared transaction from server'),
  );

  return response.data;
};

export const broadcastExternalPartyTransactionToBlockchain = async (
  params: ICantonBroadcastExternalPartyTxnParams,
  keyDB?: IKeyValueStore,
): Promise<any> => {
  const url = `${baseURL}/broadcast/external-party`;
  const response = await makePostRequestWithAuthTokenConfig(url, params, keyDB);

  assert(
    !response.data.error,
    new Error('Server: Broadcast external party txn failed'),
  );

  return response.data;
};
