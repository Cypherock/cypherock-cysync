import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IXrpCoinInfo } from '@cypherock/coins';
import { XrpApp } from '@cypherock/sdk-app-xrp';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignXrpTransactionParams,
  ISignXrpTransactionEvent,
  signXrpToDeviceEventMap,
} from './types';
import { prepareUnsignedTxn } from './unsigned';
import { signTransactionFromX0 } from './x0';

import { createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedXrpTransaction } from '../transaction';

export { prepareUnsignedTxn };

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
    signTransactionFromX0,
    createApp,
  });
