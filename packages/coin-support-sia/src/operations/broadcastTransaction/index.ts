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

  const sendAmountHastings = scToHastings(output.amount);
  const feeHastings = scToHastings(fees);

  const outputs: { address: string; value: string }[] = [
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

  try {
    const result = await broadcastBlockchainTransaction(
      selectedUtxoIds,
      outputs,
      feeHastings,
      signedTransaction,
      publicKey,
      myAddress,
    );

    if (!result.success) {
      throw new Error(
        result.error ??
          'Transaction broadcast failed. Please try again or contact support.',
      );
    }
    // Create transaction record for database
    const parsedTransaction: ITransaction = {
      hash: result.hash!,
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

    const [addedTxn] = await insertOrUpdateTransactions(db, [
      parsedTransaction,
    ]);

    return addedTxn;
  } catch (error) {
    throw new Error(`Failed to broadcast transaction: ${String(error)}`);
  }
};
