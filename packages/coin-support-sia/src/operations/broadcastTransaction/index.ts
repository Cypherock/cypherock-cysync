import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { siaCoinList } from '@cypherock/coins';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastSiaTransactionParams } from './types';

import { broadcastBlockchainTransaction } from '../../services';
import { scToHastings } from '../../utils';

export const broadcastTransaction = async (
  params: IBroadcastSiaTransactionParams,
): Promise<ITransaction> => {
  console.log('DEBUG: broadcastTransaction started');

  const { db, signedTransaction, transaction } = params;
  const { account } = await getAccountAndCoin(
    db,
    siaCoinList,
    transaction.accountId,
  );

  const myAddress = account.xpubOrAddress;
  const { selectedUtxos, output, fees, changeAmount } =
    transaction.computedData;
  const publicKey = account.extraData?.publicKey as string;

  console.log('DEBUG: Broadcast inputs:', {
    outputAddress: output.address,
    outputAmount: output.amount,
    fees,
    changeAmount,
    selectedUtxoCount: selectedUtxos.length,
  });

  // Convert SC amounts to hastings for API call
  const sendAmountHastings = scToHastings(output.amount);
  const feeHastings = scToHastings(fees);

  // Build outputs array (send + change if > 0)
  const outputs: Array<{ address: string; value: string }> = [
    {
      address: output.address,
      value: sendAmountHastings,
    },
  ];

  if (BigInt(changeAmount) > BigInt(0)) {
    outputs.push({
      address: myAddress,
      value: changeAmount,
    });
  }

  const selectedUtxoIds = selectedUtxos.map(utxo => utxo.id);

  console.log('DEBUG: Broadcasting to network:', {
    outputs: outputs.length,
    selectedUtxos: selectedUtxoIds.length,
    fee: feeHastings,
  });

  try {
    const result = await broadcastBlockchainTransaction(
      selectedUtxoIds,
      outputs,
      feeHastings,
      signedTransaction,
      publicKey,
      myAddress,
    );

    console.log('DEBUG: Broadcast result:', result);

    if (!result.success) {
      throw new Error('Broadcast failed on server');
    }

    // Create transaction record for database
    const parsedTransaction: ITransaction = {
      hash: 'Transaction submitted - awaiting confirmation', // No hash until confirmed by miners
      fees,
      amount: output.amount,
      status: TransactionStatusMap.pending,
      type: TransactionTypeMap.send,
      timestamp: Date.now(),
      blockHeight: -1,
      inputs: [
        {
          address: myAddress,
          amount: output.amount,
          isMine: true,
        },
      ],
      outputs: [
        {
          address: output.address,
          amount: output.amount,
          isMine: false,
        },
      ],
      confirmations: 0,
      accountId: account.__id,
      walletId: account.walletId,
      assetId: account.assetId,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      parentAccountId: account.parentAccountId,
    };

    console.log('DEBUG: Adding transaction to database');
    const [addedTxn] = await insertOrUpdateTransactions(db, [
      parsedTransaction,
    ]);

    console.log('DEBUG: broadcastTransaction completed successfully');
    return addedTxn;
  } catch (error) {
    console.log('DEBUG: Broadcast failed:', String(error));
    throw new Error(`Failed to broadcast transaction: ${String(error)}`);
  }
};
