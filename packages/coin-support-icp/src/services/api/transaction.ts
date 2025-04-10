import { makePostRequest } from '@cypherock/cysync-utils';
import type { RequestId } from '@dfinity/agent';
import type { IDL as IDLType } from '@dfinity/candid';

import { config } from '../../config';
import { HOST, ICP_LEDGER_CANISTER_ID } from '../../constants';
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
  limit: bigint,
  start?: bigint,
) => {
  try {
    const { agent, icp } = getCoinSupportDfinityLib();

    const index = icp.IndexCanister.create({
      agent: await agent.HttpAgent.create({ host: HOST }),
    });

    const response = await index.getTransactions({
      accountIdentifier: accountId,
      maxResults: limit,
      start,
    });

    return response.transactions;
  } catch (err) {
    throw new Error('Error fetching ICP account transaction history');
  }
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
  principalID: Uint8Array,
  tokenIndexCanisterId: string,
  limit: bigint,
  start?: bigint,
) => {
  try {
    const { agent, icrc, principal } = getCoinSupportDfinityLib();

    const icrcIndex = icrc.IcrcIndexCanister.create({
      agent: await agent.HttpAgent.create({ host: HOST }),
      canisterId: principal.Principal.from(tokenIndexCanisterId),
    });

    const response = await icrcIndex.getTransactions({
      account: { owner: principal.Principal.from(principalID) },
      max_results: limit,
      start,
    });

    return response.transactions;
  } catch (error) {
    throw new Error('Error fetching ICP token account transaction history');
  }
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
