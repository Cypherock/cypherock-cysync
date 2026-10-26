import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
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
} from '../../services';

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

  const { updateId, completionOffset } = await broadcastTransactionToBlockchain(
    {
      partyId: myPartyId,
      signature: hexToBase64(signedTransaction),
      publicKey: hexToBase64(account.extraData?.publicKey ?? ''),
      preparedTransaction: transaction.computedData.preparedTransaction,
    },
    keyDB,
  );

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
    hash: updateId,
    confirmations: 0,
    fees: transaction.computedData.fees,
    amount,
    status: TransactionStatusMap.pending,
    type: TransactionTypeMap.send,
    timestamp: Date.now(),
    blockHeight: completionOffset,
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
