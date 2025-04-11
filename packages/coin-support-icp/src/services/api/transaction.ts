import { makePostRequest } from '@cypherock/cysync-utils';
import type { RequestId } from '@dfinity/agent';
import type { IDL as IDLType } from '@dfinity/candid';

import { IIcpTransactionHistoryResponse } from './types';

import { config } from '../../config';
import {
  HOST,
  ICP_INDEX_CANISTER_ID,
  ICP_LEDGER_CANISTER_ID,
} from '../../constants';
import { decodeReturnValue, getCoinSupportDfinityLib } from '../../utils';
import logger from '../../utils/logger';

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
  transaction: {
    serializedTransferRequest: ArrayBuffer;
    signedReadStateRequest: object;
    transferRequestId: RequestId;
  },
  ledgerCanisterId: string,
  transferResultArgs: IDLType.VariantClass,
) => {
  try {
    const response = await fetch(
      `${HOST}/api/v2/canister/${ledgerCanisterId}/call`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/cbor' },
        body: transaction.serializedTransferRequest,
      },
    );

    if (response.ok) {
      const readStateRequest = {
        request: {
          method: 'POST',
          headers: { 'Content-Type': 'application/cbor' },
        },
        endpoint: 'read_state',
        body: transaction.signedReadStateRequest,
      };

      const { agent, principal } = getCoinSupportDfinityLib();
      const { reply } = await agent.pollForResponse(
        await agent.HttpAgent.create({ host: HOST }),
        principal.Principal.from(ledgerCanisterId),
        transaction.transferRequestId,
        agent.defaultStrategy(),
        readStateRequest,
      );

      const responseData = decodeReturnValue([transferResultArgs], reply);

      if (typeof responseData === 'object' && 'Ok' in responseData) {
        return responseData.Ok.toString();
      }

      if (typeof responseData === 'object' && 'Err' in responseData) {
        throw responseData.Err;
      } else {
        throw new Error('Unknown response');
      }
    } else {
      throw new Error('Transaction broadcast failed');
    }
  } catch (e) {
    logger.warn(e);
    throw new Error('Transaction broadcast failed');
  }
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
