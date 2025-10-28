import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IUnsignedTransaction, CantonApp } from '@cypherock/sdk-app-canton';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignCantonTransactionParams,
  ISignCantonTransactionEvent,
  signCantonToDeviceEventMap,
} from './types';

import { createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedCantonTransaction } from '../transaction';

const prepareUnsignedTxn = async (
  transaction: IPreparedCantonTransaction,
): Promise<IUnsignedTransaction> => {
  const prepared = transaction.computedData.preparedTransaction;

  return {
    protoSerializedPreparedTransaction: prepared.command.preparedTransaction,
  };
};

const signTransactionFromDevice: SignTransactionFromDevice<
  CantonApp,
  string
> = async params => {
  const { app, observer, transaction, account } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedCantonTransaction,
  );

  assert(txn, 'Missing unsigned transaction');

  const { signature } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    onEvent: event => {
      const deviceEvent = signCantonToDeviceEventMap[event];
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
  params: ISignCantonTransactionParams,
): Observable<ISignCantonTransactionEvent> =>
  makeSignTransactionsObservable<
    CantonApp,
    ISignCantonTransactionEvent,
    string
  >({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
