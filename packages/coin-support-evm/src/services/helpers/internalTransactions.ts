import { IAccount, ITransaction } from '@cypherock/db-interfaces';

import { parseTransaction } from './common';

import { IEvmTransactionItem } from '../api';

export const mapInternalTransactionForDb = (params: {
  account: IAccount;
  transaction: IEvmTransactionItem;
  existingTransactions: ITransaction[];
}): ITransaction | undefined => {
  const transaction = parseTransaction(params);

  if (!transaction) {
    return undefined;
  }

  const parentTransaction = params.existingTransactions.find(
    t =>
      t.hash === transaction.hash &&
      t.accountId === params.account.__id &&
      !t.subType,
  );

  transaction.parentTransactionId = parentTransaction?.__id;
  transaction.confirmations = parentTransaction?.confirmations ?? 1;
  transaction.subType = `internal`;
  transaction.customId = `${params.transaction.type}_${params.transaction.traceId}`;

  return transaction;
};

export const mapInternalTransactionsForDb = (params: {
  account: IAccount;
  transactions: IEvmTransactionItem[];
  existingTransactions: ITransaction[];
}): ITransaction[] => {
  const { account, transactions, existingTransactions } = params;

  const txns: ITransaction[] = transactions
    .flatMap(txn =>
      mapInternalTransactionForDb({
        account,
        transaction: txn,
        existingTransactions,
      }),
    )
    .filter(t => !!t) as ITransaction[];

  return txns;
};
