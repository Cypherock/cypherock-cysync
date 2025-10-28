import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import {
  CantonApp,
  IUnsignedTopologyTransaction,
} from '@cypherock/sdk-app-canton';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignCantonExternalPartyTransactionParams,
  ISignCantonExternalPartyTransactionEvent,
} from './types';

import { createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedCantonExternalPartyTransaction } from '../transaction';
import { signCantonToDeviceEventMap } from '../types';

const prepareUnsignedTopologyTxn = (
  transaction: IPreparedCantonExternalPartyTransaction,
): IUnsignedTopologyTransaction => {
  const prepared = transaction.computedData.preparedTransaction;

  return {
    partyTransactions: prepared.topologyTransactions,
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

  const topologyTxn = prepareUnsignedTopologyTxn(
    transaction as IPreparedCantonExternalPartyTransaction,
  );

  assert(topologyTxn, 'Missing unsigned transaction');

  const { signature } = await app.signTopologyTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    topologyTxn,
    onEvent: event => {
      const deviceEvent = signCantonToDeviceEventMap[event];
      if (deviceEvent !== undefined) {
        events[deviceEvent] = true;
      }

      observer.next({ type: 'Device', device: { isDone: false, events } });
    },
  });

  observer.next({ type: 'Device', device: { isDone: true, events } });

  assert(signature, new Error('Failed to sign topology transaction'));

  return signature;
};

export const signExternalPartyTransaction = (
  params: ISignCantonExternalPartyTransactionParams,
): Observable<ISignCantonExternalPartyTransactionEvent> =>
  makeSignTransactionsObservable<
    CantonApp,
    ISignCantonExternalPartyTransactionEvent,
    string
  >({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
