import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { icpCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { IcpApp, ISignTxnData, ISignTxnResult } from '@cypherock/sdk-app-icp';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignIcpTransactionParams,
  ISignIcpTransactionEvent,
  signIcpToDeviceEventMap,
} from './types';

import {
  createApp,
  prepareTokenTransferRequest,
  prepareTransferRequest,
} from '../../utils';
import { IPreparedIcpTransaction } from '../transaction';
import { IIcpAccount } from '../types';

const prepareUnsignedTransaction = (
  transaction: IPreparedIcpTransaction,
  account: IIcpAccount,
): ISignTxnData => {
  const isTokenAccount = account.type === AccountTypeMap.subAccount;

  const transferRequest = isTokenAccount
    ? prepareTokenTransferRequest(
        transaction.computedData,
        account.extraData.publicKey,
        icpCoinList[account.parentAssetId].tokens[account.assetId].canisters
          .ledger,
      )
    : prepareTransferRequest(
        transaction.computedData,
        account.extraData.publicKey,
      );

  return {
    icpTransferReq: {
      requestType: new TextEncoder().encode(transferRequest.request_type),
      canisterId: transferRequest.canister_id.toUint8Array(),
      methodName: new TextEncoder().encode(transferRequest.method_name),
      arg: new Uint8Array(transferRequest.arg),
      sender: transferRequest.sender,
      ingressExpiry: new Uint8Array(transferRequest.ingress_expiry.toHash()),
      nonce: new Uint8Array(transferRequest.nonce),
    },
  };
};

const signTransactionFromDevice: SignTransactionFromDevice<
  IcpApp,
  ISignTxnResult
> = async params => {
  const { app, observer, transaction, account } = params;

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = prepareUnsignedTransaction(
    transaction as IPreparedIcpTransaction,
    account as IIcpAccount,
  );

  assert(txn, 'Missing unsigned transaction');

  const signature = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    onEvent: event => {
      const deviceEvent = signIcpToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  assert(signature, new Error('Failed to sign transaction'));

  return signature;
};

export const signTransaction = (
  params: ISignIcpTransactionParams,
): Observable<ISignIcpTransactionEvent> =>
  makeSignTransactionsObservable<
    IcpApp,
    ISignIcpTransactionEvent,
    ISignTxnResult
  >({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
