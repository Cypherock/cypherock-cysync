import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { BtcApp } from '@cypherock/sdk-app-btc';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import { mapPreparedTxnToSdkTxn } from './map';
import {
  ISignBtcTransactionParams,
  ISignBtcTransactionEvent,
  signBtcToDeviceEventMap,
} from './types';
import { signTransactionFromX0 } from './x0';

import { createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedBtcTransaction } from '../transaction';

const signTransactionFromDevice: SignTransactionFromDevice<
  BtcApp,
  string
> = async params => {
  const { app, observer, transaction, account } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const { signedTransaction } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn: mapPreparedTxnToSdkTxn(transaction as IPreparedBtcTransaction),
    onEvent: event => {
      const deviceEvent = signBtcToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  return signedTransaction;
};

export const signTransaction = (
  params: ISignBtcTransactionParams,
): Observable<ISignBtcTransactionEvent> =>
  makeSignTransactionsObservable<BtcApp, ISignBtcTransactionEvent, string>({
    ...params,
    signTransactionFromDevice,
    signTransactionFromX0,
    createApp,
  });
