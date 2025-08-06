import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IStellarCoinInfo } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { StellarApp, IUnsignedTransaction } from '@cypherock/sdk-app-stellar';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignStellarTransactionParams,
  ISignStellarTransactionEvent,
  signStellarToDeviceEventMap,
} from './types';

import { getSequence, getTimeBounds } from '../../services';
import {
  createApp,
  getCoinSupportStellarLib,
  deriveAddress,
} from '../../utils';
import logger from '../../utils/logger';
import { IPreparedStellarTransaction, StellarMemoType } from '../transaction';

const prepareUnsignedTxn = async (
  transaction: IPreparedStellarTransaction,
  coin: IStellarCoinInfo,
  account: IAccount,
): Promise<IUnsignedTransaction> => {
  const stellarLib = getCoinSupportStellarLib();
  const myAddress = deriveAddress(account.xpubOrAddress);

  const networkPassphrase =
    coin.network === 'testnet'
      ? stellarLib.Networks.TESTNET
      : stellarLib.Networks.PUBLIC;

  const { minTime, maxTime } = await getTimeBounds();

  let sequence: number;
  try {
    sequence = await getSequence(myAddress, account.assetId);
  } catch (error) {
    // For non-activated accounts or API failures, start with sequence 0
    logger.warn('Could not get sequence, using 0 for new account:', { error });
    sequence = 0;
  }

  const sourceAccount = new stellarLib.Account(myAddress, sequence.toString());

  const txBuilder = new stellarLib.TransactionBuilder(sourceAccount, {
    fee: transaction.computedData.fees,
    networkPassphrase,
    timebounds: {
      minTime: minTime || 0,
      maxTime: maxTime || 0,
    },
  });

  if (transaction.computedData.output.isCreateAccount) {
    // Create Account operation
    txBuilder.addOperation(
      stellarLib.Operation.createAccount({
        destination: transaction.computedData.output.address,
        startingBalance:
          // Convert stroops to XLM for the operation
          new BigNumber(transaction.computedData.output.amount)
            .dividedBy(10000000)
            .toString(),
      }),
    );
  } else {
    // Payment operation
    txBuilder.addOperation(
      stellarLib.Operation.payment({
        destination: transaction.computedData.output.address,
        asset: stellarLib.Asset.native(),
        amount:
          // Convert stroops to XLM
          new BigNumber(transaction.computedData.output.amount)
            .dividedBy(10000000)
            .toString(),
      }),
    );
  }

  const { memo } = transaction.computedData.output;
  if (memo && memo.type !== StellarMemoType.NONE) {
    try {
      switch (memo.type) {
        case StellarMemoType.TEXT:
          if (memo.value) {
            txBuilder.addMemo(stellarLib.Memo.text(memo.value));
          }
          break;

        case StellarMemoType.ID:
          if (memo.value && /^\d+$/.test(memo.value)) {
            txBuilder.addMemo(stellarLib.Memo.id(memo.value));
          }
          break;

        case StellarMemoType.HASH:
          if (
            memo.value &&
            memo.value.length === 64 &&
            /^[0-9a-fA-F]+$/.test(memo.value)
          ) {
            txBuilder.addMemo(stellarLib.Memo.hash(memo.value));
          }
          break;

        case StellarMemoType.RETURN:
          if (
            memo.value &&
            memo.value.length === 64 &&
            /^[0-9a-fA-F]+$/.test(memo.value)
          ) {
            txBuilder.addMemo(stellarLib.Memo.return(memo.value));
          }
          break;

        default:
          logger.warn('Unknown memo type, skipping:', { type: memo.type });
      }
    } catch (error) {
      logger.error('Error adding memo, continuing without memo:', { error });
    }
  }

  const tx = txBuilder.build();

  const xdr = tx.toEnvelope().toXDR('base64');

  const unsignedTxn: IUnsignedTransaction = {
    xdr,
    networkPassphrase,
  };

  return unsignedTxn;
};

const signTransactionFromDevice: SignTransactionFromDevice<
  StellarApp,
  string
> = async params => {
  const { app, observer, transaction, account, coin } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedStellarTransaction,
    coin as IStellarCoinInfo,
    account,
  );

  assert(txn, 'Missing unsigned transaction');

  const { serializedTxn } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    serializeTxn: true,
    onEvent: event => {
      const deviceEvent = signStellarToDeviceEventMap[event];
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
  params: ISignStellarTransactionParams,
): Observable<ISignStellarTransactionEvent> =>
  makeSignTransactionsObservable<
    StellarApp,
    ISignStellarTransactionEvent,
    string
  >({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
