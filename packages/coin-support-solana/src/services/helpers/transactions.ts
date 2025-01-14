import {
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISolanaTransactionItem } from '../api';

import {
  parseTokenTransactionItem,
  parseTransactionItem,
  TransactionParserReturnType,
} from './common';

export const mapTransactionsForDb = async (params: {
  db: IDatabase;
  account: IAccount;
  rawTransactions: ISolanaTransactionItem[];
}): Promise<TransactionParserReturnType> => {
  const { db, account, rawTransactions } = params;
  const result: TransactionParserReturnType = {
    transactions: [],
    newAccounts: [],
  };

  for (const rawTxn of rawTransactions) {
    const { transactions, newAccounts } = await parseTransactionItem({
      db,
      account,
      transactionItem: rawTxn,
    });

    result.transactions.push(...transactions);
    result.newAccounts.push(...newAccounts);

    // Even if the transaction failed, the transaction fee is still deducted.
    for (const transaction of transactions) {
      if (
        transaction.status === TransactionStatusMap.failed &&
        transaction.type === TransactionTypeMap.send
      ) {
        result.transactions.push({
          ...transaction,
          status: TransactionStatusMap.success,
          type: TransactionTypeMap.hidden,
          amount: '0',
        });
      }
    }
  }

  return result;
};

export const mapTokenTransactionsForDb = (
  account: IAccount,
  rawTransactions: ISolanaTransactionItem[],
): ITransaction[] => {
  const transactions: ITransaction[] = [];

  for (const rawTxn of rawTransactions) {
    const txns = parseTokenTransactionItem(rawTxn, account);
    transactions.push(...txns);
  }

  return transactions;
};
