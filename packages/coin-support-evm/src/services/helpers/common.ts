import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  IAccount,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IEvmTransactionItem } from '../api';

export const parseTransaction = (params: {
  transaction: IEvmTransactionItem;
  account: IAccount;
}) => {
  const { account, transaction } = params;

  const myAddress = account.xpubOrAddress.toLowerCase();

  const fees = new BigNumber(transaction.gasPrice || 0).multipliedBy(
    new BigNumber(transaction.gasUsed || 0),
  );

  const fromAddr = transaction.from.toLowerCase();
  const toAddr = transaction.to.toLowerCase();
  const selfTransfer = fromAddr === toAddr;
  const amount = String(transaction.value || 0);

  if (fromAddr !== myAddress && toAddr !== myAddress) {
    return undefined;
  }

  const txn: ITransaction = {
    hash: transaction.hash,
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    amount: selfTransfer ? '0' : amount,
    fees: fees.toString(),
    confirmations: new BigNumber(transaction.confirmations).toNumber() || 0,
    status:
      transaction.isError === '0'
        ? TransactionStatusMap.success
        : TransactionStatusMap.failed,
    type:
      myAddress === fromAddr
        ? TransactionTypeMap.send
        : TransactionTypeMap.receive,
    timestamp: new Date(parseInt(transaction.timeStamp, 10) * 1000).getTime(),
    blockHeight: new BigNumber(transaction.blockNumber).toNumber(),
    inputs: [
      {
        address: fromAddr,
        amount,
        isMine: myAddress === fromAddr,
      },
    ],
    outputs: [
      {
        address: toAddr,
        amount,
        isMine: myAddress === toAddr,
      },
    ],
  };

  return txn;
};
