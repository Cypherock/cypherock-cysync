import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IEvmCoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { EvmApp, ISignTxnParams } from '@cypherock/sdk-app-evm';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignEvmTransactionParams,
  ISignEvmTransactionEvent,
  signEvmToDeviceEventMap,
} from './types';

import { getTransactionCount } from '../../services';
import { createApp, getCoinSupportEthersLib } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedEvmTransaction } from '../transaction';

const prepareUnsignedTxn = async (
  transaction: IPreparedEvmTransaction,
  coin: IEvmCoinInfo,
  account: IAccount,
): Promise<ISignTxnParams['txn']> => {
  const nonce =
    transaction.userInputs.nonce ??
    (await getTransactionCount(account.xpubOrAddress, coin.id));
  const txn = getCoinSupportEthersLib().Transaction.from({
    // eslint-disable-next-line radix
    nonce: parseInt(nonce.toString()),
    to: transaction.computedData.output.address,
    data: transaction.computedData.data,
    gasLimit: transaction.computedData.gasLimit,
    gasPrice: transaction.computedData.gasPrice,
    value: transaction.computedData.output.amount,
    chainId: coin.chain,
    // currently firmware only supports EIP-155 transaction types
    type: 0,
  });

  assert(
    txn.unsignedSerialized,
    new Error('Failed to prepare unsigned transaction'),
  );
  return txn.unsignedSerialized;
};

const signTransactionFromDevice: SignTransactionFromDevice<
  EvmApp
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
  makeSignTransactionsObservable<EvmApp, ISignEvmTransactionEvent>({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
