import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { stellarCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastStellarTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';

export const broadcastTransaction = async (
  params: IBroadcastStellarTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    stellarCoinList,
    transaction.accountId,
  );

  const result = await broadcastTransactionToBlockchain(
    signedTransaction,
    coin.id,
  );

  const myAddress = account.xpubOrAddress;
  const {
    address: outputAddress,
    memo,
    isActivated,
  } = transaction.computedData.output;

  const parsedTransaction: ITransaction = {
    hash: result.hash,
    fees: transaction.computedData.fees,
    amount: '0',
    status: TransactionStatusMap.pending,
    type: TransactionTypeMap.send,
    timestamp: Date.now(),
    blockHeight: -1,
    inputs: [
      {
        address: myAddress,
        amount: '0',
        isMine: true,
      },
    ],
    outputs: [
      {
        ...params.transaction.userInputs.outputs[0],
        isMine: outputAddress === myAddress,
      },
    ],
    confirmations: 0,
    accountId: account.__id,
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    parentAccountId: account.parentAccountId,
    remarks: [transaction.userInputs.outputs[0].remarks ?? ''],
    customId: `id-0`, // 0 is index, since we have single transaction operation
    extraData: {
      operation: isActivated ? 'payment' : 'createAccount',
      memoType: memo?.type,
      memo: memo?.value,
    },
  };

  const amount = parsedTransaction.outputs.reduce(
    (sum, output) => (output.isMine ? sum : sum.plus(output.amount)),
    new BigNumber(0),
  );
  parsedTransaction.amount = amount.abs().toString();
  parsedTransaction.inputs[0].amount = amount.abs().toString();

  const [addedTxn] = await insertOrUpdateTransactions(db, [parsedTransaction]);

  return addedTxn;
};
