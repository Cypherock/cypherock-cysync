import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IXrpCoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { IUnsignedTransaction, XrpApp } from '@cypherock/sdk-app-xrp';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignXrpTransactionParams,
  ISignXrpTransactionEvent,
  signXrpToDeviceEventMap,
} from './types';

import * as services from '../../services';
import { createApp, getCoinSupportXrpLib } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedXrpTransaction } from '../transaction';

const prepareUnsignedTxn = async (
  transaction: IPreparedXrpTransaction,
  coin: IXrpCoinInfo,
  account: IAccount,
): Promise<IUnsignedTransaction> => {
  const xrpl = getCoinSupportXrpLib();
  const address = xrpl.deriveAddress(account.xpubOrAddress);

  const { flags, sequence } = await services.getFlagsAndSequence(
    address,
    account.assetId,
  );
  const lastLedgerSequence = await services.getLastLedgerSequence(
    account.assetId,
  );

  const rawTxn = {
    Account: address,
    Destination: transaction.computedData.output.address,
    Amount: transaction.computedData.output.amount,
    Fee: transaction.computedData.fees,
    DestinationTag: transaction.computedData.output.destinationTag,
    Flags: flags,
    Sequence: sequence,
    LastLedgerSequence: lastLedgerSequence,
    SigningPubKey: account.xpubOrAddress,
  };
  const txnHex = xrpl.encodeForSigning({
    ...rawTxn,
    TransactionType: 'Payment',
  });

  const unsignedTxn: IUnsignedTransaction = {
    txnHex,
    rawTxn: {
      ...rawTxn,
      TransactionType: 'Payment',
    },
  };

  return unsignedTxn;
};

const signTransactionFromDevice: SignTransactionFromDevice<
  XrpApp,
  string
> = async params => {
  const { app, observer, transaction, account, coin } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedXrpTransaction,
    coin as IXrpCoinInfo,
    account,
  );

  assert(txn, 'Missing unsigned transaction');

  const { serializedTxn } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    serializeTxn: true,
    onEvent: event => {
      const deviceEvent = signXrpToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  assert(serializedTxn, new Error('Failed to sign transaction'));

  return serializedTxn;
};

export const signTransaction = (
  params: ISignXrpTransactionParams,
): Observable<ISignXrpTransactionEvent> =>
  makeSignTransactionsObservable<XrpApp, ISignXrpTransactionEvent, string>({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
