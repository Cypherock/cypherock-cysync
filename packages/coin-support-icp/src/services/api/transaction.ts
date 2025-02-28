import {
  defaultStrategy,
  HttpAgent,
  pollForResponse,
  RequestId,
} from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { IndexCanister, LedgerCanister } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';

import logger from '../../utils/logger';

const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const HOST = 'https://icp-api.io';

const Tokens = IDL.Record({ e8s: IDL.Nat64 });
const BlockIndex = IDL.Nat64;
const TransferError = IDL.Variant({
  TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
  BadFee: IDL.Record({ expected_fee: Tokens }),
  TxDuplicate: IDL.Record({ duplicate_of: BlockIndex }),
  TxCreatedInFuture: IDL.Null,
  InsufficientFunds: IDL.Record({ balance: Tokens }),
});
const TransferResult = IDL.Variant({
  Ok: BlockIndex,
  Err: TransferError,
});

const decodeReturnValue = (types: IDL.Type[], msg: ArrayBuffer) => {
  const returnValues = IDL.decode(types, Buffer.from(msg));
  switch (returnValues.length) {
    case 0:
      return undefined;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
};

export const getTransactionFee = async () => {
  const ledger = LedgerCanister.create({
    agent: await HttpAgent.create({ host: HOST }),
  });

  return ledger.transactionFee();
};

export const getTransactions = async (
  accountId: string,
  limit: bigint,
  start?: bigint,
) => {
  try {
    const agent = await HttpAgent.create({ host: HOST });
    const index = IndexCanister.create({ agent });

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

      const { reply } = await pollForResponse(
        await HttpAgent.create({ host: HOST }),
        Principal.from(ICP_LEDGER_CANISTER_ID),
        transaction.transferRequestId,
        defaultStrategy(),
        readStateRequest,
      );

      const responseData = decodeReturnValue([TransferResult], reply);

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
