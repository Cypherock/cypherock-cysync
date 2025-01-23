import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { solanaCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  AccountTypeMap,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { broadcastTransactionToBlockchain } from '../../services';

import { InstructionType } from '../../services/helpers';

import { IBroadcastSolanaTransactionParams } from './types';

export const broadcastTransaction = async (
  params: IBroadcastSolanaTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    solanaCoinList,
    transaction.accountId,
  );

  const recipientAddress = params.transaction.computedData.output.address;
  const isMine = recipientAddress === account.xpubOrAddress;

  const txnHash = await broadcastTransactionToBlockchain(
    signedTransaction,
    coin.id,
  );

  const isTokenAccount = account.type === AccountTypeMap.subAccount;

  const parsedTransaction: ITransaction = {
    hash: txnHash,
    fees: transaction.computedData.fees,
    amount: '0',
    status: TransactionStatusMap.pending,
    type: TransactionTypeMap.send,
    timestamp: Date.now(),
    blockHeight: -1,
    inputs: [
      {
        address: account.xpubOrAddress,
        amount: '0',
        isMine: true,
      },
    ],
    outputs: [
      {
        ...params.transaction.userInputs.outputs[0],
        isMine,
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
    subType: isTokenAccount
      ? InstructionType.transferChecked
      : InstructionType.transfer,
    customId: 'id-0', // 0 is index, since we have single transfer instruction
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
