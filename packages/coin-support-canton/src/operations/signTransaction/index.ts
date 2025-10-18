import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { ICantonCoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
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
  coin: ICantonCoinInfo,
  account: IAccount,
): Promise<IUnsignedTransaction> => {
  logger.info('Prepared Transaction', { transaction, coin, account });

  return { protoSerializedPreparedTransaction: '' };
};

const signTransactionFromDevice: SignTransactionFromDevice<
  CantonApp,
  string
> = async params => {
  const { app, observer, transaction, account, coin } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedCantonTransaction,
    coin as ICantonCoinInfo,
    account,
  );

  assert(txn, 'Missing unsigned transaction');

  const { serializedTxn } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    serializeTxn: true,
    onEvent: event => {
      const deviceEvent = signCantonToDeviceEventMap[event];
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
