import {
  CallRequest,
  Expiry,
  hashOfMap,
  makeNonce,
  Nonce,
  RequestId,
  SubmitRequestType,
} from '@dfinity/agent';
import { IDL, lebDecode, lebEncode, PipeArrayBuffer } from '@dfinity/candid';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import * as cbor from 'simple-cbor';

import { derivePrincipal } from './deriveAddress';

import { IPreparedIcpTransaction } from '../operations/transaction';

const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

const Tokens = IDL.Record({ e8s: IDL.Nat64 });
// const SubAccount = IDL.Vec(IDL.Nat8);
// const TimeStamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
const TransferArgs = IDL.Record({
  to: IDL.Vec(IDL.Nat8),
  amount: Tokens,
  fee: Tokens,
  memo: IDL.Nat64,
  // 'from_subaccount' : IDL.Opt(SubAccount),
  // 'created_at_time' : IDL.Opt(TimeStamp),
});

const MINUTE_TO_MSECS = 60 * 1000;
const maxIngressExpiryInMinutes = 5;

export class MyExpiry {
  private readonly _value: string;

  constructor(params: { deltaInMSec?: number; value?: string }) {
    const { deltaInMSec, value } = params;
    if (deltaInMSec) {
      const expiry = new Expiry(deltaInMSec);
      this._value = lebDecode(new PipeArrayBuffer(expiry.toHash())).toString();
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
    return lebEncode(BigInt(this._value));
  }

  public getValue(): string {
    return this._value;
  }
}

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
  const transferTxn = {
    to: AccountIdentifier.fromHex(
      preparedTxnData.output.address,
    ).toUint8Array(),
    fee: { e8s: BigInt(preparedTxnData.fees) },
    amount: { e8s: BigInt(preparedTxnData.output.amount) },
    memo: BigInt(preparedTxnData.output.memo ?? 0),
    // created_at_time: [],
    // from_subaccount: [],
  };

  return {
    request_type: SubmitRequestType.Call,
    canister_id: Principal.from(ICP_LEDGER_CANISTER_ID),
    method_name: 'transfer',
    arg: IDL.encode([TransferArgs], [transferTxn]),
    sender: derivePrincipal(publicKey),
    ingress_expiry: new MyExpiry({ value: preparedTxnData.ingressExpiry }),
    nonce: preparedTxnData.nonce,
  };
};

export const getIngressExpiry = () =>
  new MyExpiry({
    deltaInMSec: maxIngressExpiryInMinutes * MINUTE_TO_MSECS,
  }).getValue();

export const getNonce = makeNonce;

export const prepareReadStateRequest = (transferRequest: CallRequestStrict) => {
  const transferRequestId = hashOfMap(transferRequest) as RequestId;
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
