import {
  IAccount,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { parseTransaction } from './common';

import { IEvmTransactionItem } from '../api';

export const mapTransactionForDb = (params: {
  account: IAccount;
  transaction: IEvmTransactionItem;
}): ITransaction[] => {
  const txns: ITransaction[] = [];
  const txn = parseTransaction(params);

  if (txn) {
    txns.push(txn);
  }

  // Even if the transaction failed, the transaction fee is still deducted.
  if (
    txn &&
    txn.status === TransactionStatusMap.failed &&
    txn.type === TransactionTypeMap.send
  ) {
    txns.push({
      ...txn,
      status: TransactionStatusMap.success,
      type: TransactionTypeMap.hidden,
      amount: '0',
    });
  }

  return txns;
};

export const mapTransactionsForDb = (params: {
  account: IAccount;
  transactions: IEvmTransactionItem[];
}): ITransaction[] => {
  const { account, transactions } = params;

  const txns: ITransaction[] = transactions
    .flatMap(txn => mapTransactionForDb({ account, transaction: txn }))
    .filter(t => !!t) as ITransaction[];

  return txns;
};
