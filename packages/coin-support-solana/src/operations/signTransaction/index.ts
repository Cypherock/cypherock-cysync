import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import { ISolanaCoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import {
  SolanaApp,
  ISignTxnParams,
  base58Decode,
  getLatestBlockHash,
} from '@cypherock/sdk-app-solana';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignSolanaTransactionParams,
  ISignSolanaTransactionEvent,
  signSolanaToDeviceEventMap,
} from './types';

import { createApp, getCoinSupportWeb3Lib } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedSolanaTransaction } from '../transaction';

const prepareUnsignedTxn = async (
  transaction: IPreparedSolanaTransaction,
  coin: ISolanaCoinInfo,
  account: IAccount,
): Promise<ISignTxnParams['txn']> => {
  const web3Lib = getCoinSupportWeb3Lib();

  const feePayer = web3Lib.PublicKey.decode(
    Buffer.from(base58Decode(account.xpubOrAddress)).reverse(),
  );
  const receiverPublicKey = web3Lib.PublicKey.decode(
    Buffer.from(
      base58Decode(transaction.computedData.output.address),
    ).reverse(),
  );

  const recentBlockhash = await getLatestBlockHash(coin.network);

  const txn = new web3Lib.Transaction({
    recentBlockhash,
    feePayer,
  });
  txn.add(
    web3Lib.SystemProgram.transfer({
      fromPubkey: feePayer,
      toPubkey: receiverPublicKey,
      lamports: parseInt(transaction.computedData.output.amount, 10),
    }),
  );

  const unsignedSerializedTxn = txn.serializeMessage().toString('hex');
  assert(
    unsignedSerializedTxn,
    new Error('Failed to prepare unsigned transaction'),
  );

  return unsignedSerializedTxn;
};

const signTransactionFromDevice: SignTransactionFromDevice<
  SolanaApp
> = async params => {
  const { app, observer, transaction, account, coin } = params;
  logger.info({ transaction });

  const events: Record<SignTransactionDeviceEvent, boolean | undefined> =
    {} as any;

  const txn = await prepareUnsignedTxn(
    transaction as IPreparedSolanaTransaction,
    coin as ISolanaCoinInfo,
    account,
  );
  const { serializedTxn } = await app.signTxn({
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    serializeTxn: true,
    onEvent: event => {
      const deviceEvent = signSolanaToDeviceEventMap[event];
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
  params: ISignSolanaTransactionParams,
): Observable<ISignSolanaTransactionEvent> =>
  makeSignTransactionsObservable<SolanaApp, ISignSolanaTransactionEvent>({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
