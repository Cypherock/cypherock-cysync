import { IAccount, ITransaction } from '@cypherock/db-interfaces';

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

  // If it is a failed transaction, then check if it is a token transaction.
  // if (txn.status === TransactionStatusMap.failed) {
  //   let txnAmount = '0';
  //   const token = Object.values(coinData.tokenList).find(
  //     t => t.address === transaction.to.toLowerCase(),
  //   );

  //   if (token) {
  //     if (transaction.input) {
  //       txnAmount = String(getEthAmountFromInput(transaction.input));
  //     }

  //     txn.amount = txnAmount;

  //     // Even if the token transaction failed, the transaction fee is still deducted.
  //     if (txn.sentReceive === SentReceive.SENT) {
  //       history.push({
  //         accountId: item.accountId,
  //         coinId: item.coinId,
  //         parentCoinId: item.coinId,
  //         isSub: false,
  //         hash: transaction.hash as string,
  //         amount: fees.toString(),
  //         fees: '0',
  //         total: fees.toString(),
  //         confirmations: (transaction.confirmations as number) || 0,
  //         walletId: item.walletId,
  //         status: 1,
  //         sentReceive: SentReceive.FEES,
  //         confirmed: new Date(
  //           parseInt(transaction.timeStamp, 10) * 1000,
  //         ).toISOString(),
  //         blockHeight: transaction.blockNumber as number,
  //       });
  //     }
  //   }
  // }

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
