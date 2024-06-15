import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { TronApp, ISignedTransaction } from '@cypherock/sdk-app-tron';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignTronTransactionParams,
  ISignTronTransactionEvent,
  signTronToDeviceEventMap,
} from './types';

import { createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedTronTransaction } from '../transaction';

const signTransactionFromDevice: SignTransactionFromDevice<
  TronApp,
  ISignedTransaction
> = async params => {
  const { app, observer, transaction, account } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = (transaction as IPreparedTronTransaction).computedData
    .unsignedTransaction;

  assert(txn, 'Missing unsigned transaction');

  const { signedTransaction } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    serializeTxn: true,
    onEvent: event => {
      const deviceEvent = signTronToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  assert(signedTransaction, new Error('Failed to sign transaction'));

  return signedTransaction;
};

export const signTransaction = (
  params: ISignTronTransactionParams,
): Observable<ISignTronTransactionEvent> =>
  makeSignTransactionsObservable<
    TronApp,
    ISignTronTransactionEvent,
    ISignedTransaction
  >({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
