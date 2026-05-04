import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { sleep } from '@cypherock/cysync-utils';
import {
  AccountTypeMap,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { hexToBase64 } from '@cypherock/sdk-utils';

import { IBroadcastCantonTransactionParams } from './types';

import {
  broadcastTransactionToBlockchain,
  ICantonInstrument,
  ICantonWaitForTxnCompletionResult,
  waitForTxnCompletion,
} from '../../services';
import logger from '../../utils/logger';

export const broadcastTransaction = async (
  params: IBroadcastCantonTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction, keyDB } = params;
  const { account } = await getAccountAndCoin(
    db,
    cantonCoinList,
    transaction.accountId,
  );

  const myPartyId = account.xpubOrAddress;

  const { commandId, ledgerEndOffset } = await broadcastTransactionToBlockchain(
    {
      partyId: myPartyId,
      signature: hexToBase64(signedTransaction),
      publicKey: hexToBase64(account.extraData?.publicKey ?? ''),
      preparedTransaction: transaction.computedData.preparedTransaction,
    },
    keyDB,
  );

  let completionResponse: ICantonWaitForTxnCompletionResult | undefined;
  let error: string | undefined;

  // Wait for the completion of transaction before adding it to the data base
  let tries = 10;
  // eslint-disable-next-line no-plusplus
  while (!completionResponse && tries--) {
    // Txn completion typically takes 30 seconds; Waiting here in client only, so not to burn out server on polling canton blockchain
    await sleep(30000);

    error = undefined;
    try {
      completionResponse = await waitForTxnCompletion(
        {
          partyId: myPartyId,
          commandId,
          ledgerEndOffset,
          timeoutMs: 5000, // passing in just 5s: See if we can reduce it further
        },
        keyDB,
      ); // throws error if transaction didn't succeed in provided timeout
    } catch (e) {
      error = JSON.stringify(e);
    }
  }

  if (!completionResponse?.updateId || !completionResponse?.offset) {
    const err =
      'Txn completion failed in required time, but txn may still be successfull.';
    logger.error(err + error);
    throw new Error(error);
  }

  const { amount } = transaction.computedData.output;

  let instrument: ICantonInstrument;
  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    const tokenDetails =
      cantonCoinList[account.parentAssetId].tokens[account.assetId];
    instrument = tokenDetails.instrument;
  } else {
    instrument = cantonCoinList[account.assetId].instrument;
  }

  const createdTxn: ITransaction = {
    accountId: account.__id ?? '',
    parentAccountId: account.parentAccountId,
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    parentAssetId: account.parentAssetId,
    hash: completionResponse.updateId,
    confirmations: 0,
    fees: transaction.computedData.fees,
    amount,
    status: TransactionStatusMap.pending,
    type: TransactionTypeMap.send,
    timestamp: Date.now(),
    blockHeight: completionResponse.offset,
    inputs: [
      {
        address: myPartyId,
        amount,
        isMine: true,
      },
    ],
    outputs: [
      {
        address: transaction.computedData.output.address,
        amount,
        isMine: transaction.computedData.output.address === myPartyId,
      },
    ],
    remarks: [transaction.userInputs.outputs[0].remarks ?? ''],
    extraData: {
      type: 'TransferOut',
      memo: transaction.computedData.output.memo,
      instrument,
      startDate: new Date(Date.now()).toISOString(),
      expiryDate: transaction.computedData.output.expiryDate,
    },
  };

  const [addedTxn] = await insertOrUpdateTransactions(db, [createdTxn]);

  return addedTxn;
};
