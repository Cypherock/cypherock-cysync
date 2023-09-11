import { IAccount, ITransaction } from '@cypherock/db-interfaces';

import { parseTransaction } from './common';

import { IEvmTransactionItem } from '../api';

export const mapInternalTransactionForDb = (params: {
  account: IAccount;
  transaction: IEvmTransactionItem;
}): ITransaction | undefined => parseTransaction(params);

export const mapInternalTransactionsForDb = (params: {
  account: IAccount;
  transactions: IEvmTransactionItem[];
}): ITransaction[] => {
  const { account, transactions } = params;

  const txns: ITransaction[] = transactions
    .flatMap(txn => mapInternalTransactionForDb({ account, transaction: txn }))
    .filter(t => !!t) as ITransaction[];

  return txns;
};
