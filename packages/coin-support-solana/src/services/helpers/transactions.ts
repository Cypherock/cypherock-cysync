import {
  IAccount,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { parseTransactionItem } from './common';

import { ISolanaTransactionItem } from '../api';

export const mapTransactionForDb = (params: {
  account: IAccount;
  transactionItem: ISolanaTransactionItem;
}): ITransaction[] => {
  const transactions: ITransaction[] = [];
  const parsedTransactions = parseTransactionItem(params);

  transactions.push(...parsedTransactions);

  // Even if the transaction failed, the transaction fee is still deducted.
  for (const transaction of parsedTransactions) {
    if (
      transaction.status === TransactionStatusMap.failed &&
      transaction.type === TransactionTypeMap.send
    ) {
      transactions.push({
        ...transaction,
        status: TransactionStatusMap.success,
        type: TransactionTypeMap.hidden,
        amount: '0',
      });
    }
  }

  return transactions;
};

export const mapTransactionsForDb = (params: {
  account: IAccount;
  transactions: ISolanaTransactionItem[];
}): ITransaction[] => {
  const { account, transactions } = params;

  const txns: ITransaction[] = transactions.flatMap(txn =>
    mapTransactionForDb({ account, transactionItem: txn }),
  );

  return txns;
};
