import type { CallRequest, Nonce, RequestId } from '@dfinity/agent';
import type { IDL as IDLType } from '@dfinity/candid';
import * as cbor from 'simple-cbor';

import { derivePrincipal } from './deriveAddress';
import { getCoinSupportDfinityLib } from './dfinityLib';

import { IPreparedIcpTransaction } from '../operations/transaction';

const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

const MINUTE_TO_MSECS = 60 * 1000;
const maxIngressExpiryInMinutes = 5;

// The Expiry class from @dfinity/agent has some limitations for our use case
export class MyExpiry {
  private readonly _value: string;

  constructor(params: { deltaInMSec?: number; value?: string }) {
    const { deltaInMSec, value } = params;
    if (deltaInMSec) {
      const { agent, candid } = getCoinSupportDfinityLib();
      const expiry = new agent.Expiry(deltaInMSec);
      this._value = candid
        .lebDecode(new candid.PipeArrayBuffer(expiry.toHash()))
        .toString();
    } else if (value) {
      this._value = value;
    } else {
      throw new Error('Invalid params to MyExpiry');
    }
  }

  public toCBOR(): cbor.CborValue {
    return cbor.value.u64(BigInt(this._value).toString(16), 16);
  }

  public toHash(): ArrayBuffer {
    const { candid } = getCoinSupportDfinityLib();
    return candid.lebEncode(BigInt(this._value));
  }

  public getValue(): string {
    return this._value;
  }
}

// Ref: https://github.com/dfinity/ic-js/blob/main/packages/ledger-icp/candid/ledger.certified.idl.js#L291
const getTransferArgs = () => {
  const { candid } = getCoinSupportDfinityLib();

  const { IDL } = candid;
  const Tokens = IDL.Record({ e8s: IDL.Nat64 });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const TimeStamp = IDL.Record({ timestamp_nanos: IDL.Nat64 });

  return IDL.Record({
    to: IDL.Vec(IDL.Nat8),
    amount: Tokens,
    fee: Tokens,
    memo: IDL.Nat64,
    from_subaccount: IDL.Opt(SubAccount),
    created_at_time: IDL.Opt(TimeStamp),
  });
};

// Ref: https://github.com/dfinity/ic-js/blob/main/packages/ledger-icrc/candid/icrc_ledger.certified.idl.js#L178
const getTokenTransferArgs = () => {
  const { candid } = getCoinSupportDfinityLib();

  const { IDL } = candid;
  const Tokens = IDL.Nat;
  const SubAccount = IDL.Vec(IDL.Nat8);
  const TimeStamp = IDL.Nat64;
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(SubAccount),
  });

  return IDL.Record({
    to: Account,
    amount: Tokens,
    fee: IDL.Opt(Tokens),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(SubAccount),
    created_at_time: IDL.Opt(TimeStamp),
  });
};

export const getTransferResultArgs = () => {
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

export const getTokenTransferResultArgs = () => {
  const { candid } = getCoinSupportDfinityLib();

  const { IDL } = candid;
  const Tokens = IDL.Nat;
  const Timestamp = IDL.Nat64;
  const BlockIndex = IDL.Nat;

  const TransferError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    BadBurn: IDL.Record({ min_burn_amount: Tokens }),
    Duplicate: IDL.Record({ duplicate_of: BlockIndex }),
    BadFee: IDL.Record({ expected_fee: Tokens }),
    CreatedInFuture: IDL.Record({ ledger_time: Timestamp }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: Tokens }),
  });

  return IDL.Variant({
    Ok: BlockIndex,
    Err: TransferError,
  });
};

export const decodeReturnValue = (types: IDLType.Type[], msg: ArrayBuffer) => {
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

type CallRequestStrict = Omit<
  CallRequest,
  'nonce' | 'sender' | 'ingress_expiry'
> & {
  nonce: Nonce;
  sender: Uint8Array;
  ingress_expiry: MyExpiry;
};

export const prepareTransferRequest = (
  preparedTxnData: IPreparedIcpTransaction['computedData'],
  publicKey: string,
): CallRequestStrict => {
  const { agent, candid, icp, principal } = getCoinSupportDfinityLib();

  const transferTxn = {
    to: icp.AccountIdentifier.fromHex(
      preparedTxnData.output.address,
    ).toUint8Array(),
    fee: { e8s: BigInt(preparedTxnData.fees) },
    amount: { e8s: BigInt(preparedTxnData.output.amount) },
    memo: BigInt(preparedTxnData.output.memo ?? 0),
    created_at_time: [],
    from_subaccount: [],
  };

  return {
    request_type: agent.SubmitRequestType.Call,
    canister_id: principal.Principal.from(ICP_LEDGER_CANISTER_ID),
    method_name: 'transfer',
    arg: candid.IDL.encode([getTransferArgs()], [transferTxn]),
    sender: derivePrincipal(publicKey),
    ingress_expiry: new MyExpiry({ value: preparedTxnData.ingressExpiry }),
    nonce: preparedTxnData.nonce,
  };
};

export const prepareTokenTransferRequest = (
  preparedTxnData: IPreparedIcpTransaction['computedData'],
  publicKey: string,
  tokenLedgerCanisterId: string,
): CallRequestStrict => {
  const { agent, candid, principal } = getCoinSupportDfinityLib();

  const tokenTransferTxn = {
    to: {
      owner: principal.Principal.fromText(preparedTxnData.output.address),
      subaccount: [],
    },
    fee: [BigInt(preparedTxnData.fees)],
    amount: BigInt(preparedTxnData.output.amount),
    memo: [],
    created_at_time: [],
    from_subaccount: [],
  };

  return {
    request_type: agent.SubmitRequestType.Call,
    canister_id: principal.Principal.fromText(tokenLedgerCanisterId),
    method_name: 'icrc1_transfer',
    arg: candid.IDL.encode([getTokenTransferArgs()], [tokenTransferTxn]),
    sender: derivePrincipal(publicKey),
    ingress_expiry: new MyExpiry({ value: preparedTxnData.ingressExpiry }),
    nonce: preparedTxnData.nonce,
  };
};

export const getIngressExpiry = () =>
  new MyExpiry({
    deltaInMSec: maxIngressExpiryInMinutes * MINUTE_TO_MSECS,
  }).getValue();

export const getNonce = () => {
  const { agent } = getCoinSupportDfinityLib();
  return agent.makeNonce();
};

export const prepareReadStateRequest = (transferRequest: CallRequestStrict) => {
  const { agent } = getCoinSupportDfinityLib();
  const transferRequestId = agent.hashOfMap(transferRequest) as RequestId;
  const path = [new TextEncoder().encode('request_status'), transferRequestId];
  return {
    transferRequestId,
    readStateRequest: {
      request_type: 'read_state',
      paths: [path],
      sender: transferRequest.sender,
      ingress_expiry: transferRequest.ingress_expiry,
    },
  };
};
