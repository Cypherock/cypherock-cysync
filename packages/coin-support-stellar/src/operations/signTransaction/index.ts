import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  getDefaultUnit,
  getParsedAmount,
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { IStellarCoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { StellarApp, IUnsignedTransaction } from '@cypherock/sdk-app-stellar';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignStellarTransactionParams,
  ISignStellarTransactionEvent,
  signStellarToDeviceEventMap,
} from './types';

import { getSequence } from '../../services';
import { createApp, getCoinSupportStellarLib } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedStellarTransaction, IStellarMemoType } from '../transaction';

const prepareUnsignedTxn = async (
  transaction: IPreparedStellarTransaction,
  coin: IStellarCoinInfo,
  account: IAccount,
): Promise<IUnsignedTransaction> => {
  const stellarLib = getCoinSupportStellarLib();
  const myAddress = account.xpubOrAddress;

  const { fees, output } = transaction.computedData;
  const { address: destination, isActivated, memo } = output;

  const networkPassphrase =
    coin.network === 'testnet'
      ? stellarLib.Networks.TESTNET
      : stellarLib.Networks.PUBLIC;

  const sequence = await getSequence(myAddress, account.assetId);

  const sourceAccount = new stellarLib.Account(myAddress, sequence.toString());

  const txBuilder = new stellarLib.TransactionBuilder(sourceAccount, {
    fee: fees,
    networkPassphrase,
    timebounds: {
      minTime: 0,
      maxTime: 0,
    },
  });

  const { amount } = getParsedAmount({
    coinId: coin.id,
    unitAbbr: getDefaultUnit(coin.id).abbr,
    amount: transaction.computedData.output.amount,
  });

  if (!isActivated) {
    txBuilder.addOperation(
      stellarLib.Operation.createAccount({
        destination,
        startingBalance: amount,
      }),
    );
  } else {
    txBuilder.addOperation(
      stellarLib.Operation.payment({
        destination,
        asset: stellarLib.Asset.native(),
        amount,
      }),
    );
  }

  if (memo && memo.type !== IStellarMemoType.NONE && memo.value) {
    try {
      switch (memo.type) {
        case IStellarMemoType.TEXT:
          txBuilder.addMemo(stellarLib.Memo.text(memo.value));
          break;
        case IStellarMemoType.ID:
          txBuilder.addMemo(stellarLib.Memo.id(memo.value));
          break;
        case IStellarMemoType.HASH:
          txBuilder.addMemo(stellarLib.Memo.hash(memo.value));
          break;
        case IStellarMemoType.RETURN:
          txBuilder.addMemo(stellarLib.Memo.return(memo.value));
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
