import type { RequestId } from '@dfinity/agent';
import type { IDL as IDLType } from '@dfinity/candid';

import { getCoinSupportDfinityLib } from '../../utils';
import logger from '../../utils/logger';

const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const HOST = 'https://icp-api.io';

const decodeReturnValue = (types: IDLType.Type[], msg: ArrayBuffer) => {
  const { candid } = getCoinSupportDfinityLib();
  const returnValues = candid.IDL.decode(types, Buffer.from(msg));
  switch (returnValues.length) {
    case 0:
      return undefined;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
};

const getTransferResultArgs = () => {
  const { candid } = getCoinSupportDfinityLib();

  const { IDL } = candid;
  const Tokens = IDL.Record({ e8s: IDL.Nat64 });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
    BadFee: IDL.Record({ expected_fee: Tokens }),
    TxDuplicate: IDL.Record({ duplicate_of: BlockIndex }),
    TxCreatedInFuture: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: Tokens }),
  });

  return IDL.Variant({
    Ok: BlockIndex,
    Err: TransferError,
  });
};

export const getTransactionFee = async () => {
  const { agent, icp } = getCoinSupportDfinityLib();
  const ledger = icp.LedgerCanister.create({
    agent: await agent.HttpAgent.create({ host: HOST }),
  });

  return ledger.transactionFee();
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

export const broadcastTransactionToBlockchain = async (transaction: {
  serializedTransferRequest: ArrayBuffer;
  signedReadStateRequest: object;
  transferRequestId: RequestId;
}) => {
  try {
    const response = await fetch(
      `${HOST}/api/v2/canister/${ICP_LEDGER_CANISTER_ID}/call`,
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
        principal.Principal.from(ICP_LEDGER_CANISTER_ID),
        transaction.transferRequestId,
        agent.defaultStrategy(),
        readStateRequest,
      );

      const responseData = decodeReturnValue([getTransferResultArgs()], reply);

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
