import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { BtcApp, ISignTxnParams } from '@cypherock/sdk-app-btc';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignBtcTransactionParams,
  ISignBtcTransactionEvent,
  signBtcToDeviceEventMap,
} from './types';

import { createApp } from '../../utils';
import { IPreparedBtcTransaction } from '../transaction';

const mapPreparedTxnToSdkTxn = (
  transaction: IPreparedBtcTransaction,
): ISignTxnParams['txn'] => ({
  inputs: transaction.computedData.inputs.map(input => {
    const path = mapDerivationPath(input.derivationPath);

    return {
      address: input.address,
      value: input.value.toString(),
      chainIndex: path[3],
      addressIndex: path[4],
      prevIndex: input.vout,
      prevTxnHash: input.txId,
      prevTxn: '',
    };
  }),
  outputs: transaction.computedData.outputs.map(output => {
    if (output.derivationPath) {
      const path = mapDerivationPath(output.derivationPath);

      return {
        isChange: true,
        address: output.address,
        value: output.value.toString(),
        chainIndex: path[3],
        addressIndex: path[4],
      };
    }

    return {
      isChange: false,
      address: output.address,
      value: output.value.toString(),
    };
  }),
});

const signTransactionFromDevice: SignTransactionFromDevice<
  BtcApp
> = async params => {
  const { app, observer, transaction, account } = params;

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const { signatures } = await app.signTxn({
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

  // TODO: Replace this with signed transaction
  return signatures.join('');
};

export const signTransaction = (
  params: ISignBtcTransactionParams,
): Observable<ISignBtcTransactionEvent> =>
  makeSignTransactionsObservable<BtcApp, ISignBtcTransactionEvent>({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
