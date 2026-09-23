import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IEvmCoinInfo } from '@cypherock/coins';
import { EvmApp } from '@cypherock/sdk-app-evm';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignEvmTransactionParams,
  ISignEvmTransactionEvent,
  signEvmToDeviceEventMap,
} from './types';
import { prepareUnsignedTxn } from './unsigned';
import { signTransactionFromX0 } from './x0';

import { createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedEvmTransaction } from '../transaction';

export { prepareUnsignedTxn };

const signTransactionFromDevice: SignTransactionFromDevice<
  EvmApp,
  string
> = async params => {
  const { app, observer, transaction, account, coin } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedEvmTransaction,
    coin as IEvmCoinInfo,
    account,
  );
  const { serializedTxn } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    serializeTxn: true,
    onEvent: event => {
      const deviceEvent = signEvmToDeviceEventMap[event];
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
  params: ISignEvmTransactionParams,
): Observable<ISignEvmTransactionEvent> =>
  makeSignTransactionsObservable<EvmApp, ISignEvmTransactionEvent, string>({
    ...params,
    signTransactionFromDevice,
    signTransactionFromX0,
    createApp,
  });
