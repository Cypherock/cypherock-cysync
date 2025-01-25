import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  makeSignTransactionsObservable,
  mapDerivationPath,
  SignTransactionFromDevice,
} from '@cypherock/coin-support-utils';
import {
  ISolanaCoinInfo,
  ISolanaSplToken,
  solanaCoinList,
} from '@cypherock/coins';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';
import {
  SolanaApp,
  ISignTxnParams,
  base58Decode,
} from '@cypherock/sdk-app-solana';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';
import { Observable } from 'rxjs';

import {
  ISignSolanaTransactionParams,
  ISignSolanaTransactionEvent,
  signSolanaToDeviceEventMap,
} from './types';

import { constructTransaction, createApp } from '../../utils';
import logger from '../../utils/logger';
import { IPreparedSolanaTransaction } from '../transaction';

const prepareUnsignedTxn = async (
  transaction: IPreparedSolanaTransaction,
  coin: ISolanaCoinInfo,
  account: IAccount,
): Promise<ISignTxnParams['txn']> => {
  const { instructions, computeUnits, computeUnitPriceMicroLamports } =
    transaction.computedData;

  const txn = await constructTransaction(
    coin.id,
    account.xpubOrAddress,
    instructions,
    {
      computeUnits,
      computeUnitPrice: computeUnitPriceMicroLamports,
    },
  );

  const unsignedSerializedTxn = txn.serializeMessage().toString('hex');
  assert(
    unsignedSerializedTxn,
    new Error('Failed to prepare unsigned transaction'),
  );

  return unsignedSerializedTxn;
};

const signTransactionFromDevice: SignTransactionFromDevice<
  SolanaApp,
  string
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

  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  let tokenDetails: ISolanaSplToken | undefined;
  if (isTokenAccount)
    tokenDetails =
      solanaCoinList[account.parentAssetId].tokens[account.assetId];

  const signTxnParams: ISignTxnParams = {
    walletId: hexToUint8Array(account.walletId),
    derivationPath: mapDerivationPath(account.derivationPath),
    txn,
    serializeTxn: true,
  };

  if (tokenDetails) {
    signTxnParams.tokenData = {
      recipientAddress: base58Decode(
        (transaction as IPreparedSolanaTransaction).computedData.output.address,
      ),
    };
  }

  const { serializedTxn } = await app.signTxn({
    ...signTxnParams,
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
  makeSignTransactionsObservable<
    SolanaApp,
    ISignSolanaTransactionEvent,
    string
  >({
    ...params,
    signTransactionFromDevice,
    createApp,
  });
