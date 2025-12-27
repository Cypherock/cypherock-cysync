import {
  createSyncAccountsObservable,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import {
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { ISiaAccount } from '../types';

import { ISyncSiaAccountsParams } from './types';

import * as services from '../../services';

const PER_PAGE_TXN_LIMIT = 100;

const parseTransaction = (
  tx: services.ISiaTransactionHistory,
  account: IAccount,
): ITransaction => {
  const transaction: ITransaction = {
    hash: tx.id,
    amount: tx.amount,
    fees: tx.fee ?? '0',
    status: TransactionStatusMap.success,
    type:
      tx.type === 'send' ? TransactionTypeMap.send : TransactionTypeMap.receive,
    timestamp: new Date(tx.timestamp).getTime(),
    blockHeight: tx.blockHeight,
    confirmations: tx.confirmations,

    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,

    inputs: [
      {
        address:
          tx.type === 'send' ? account.xpubOrAddress : tx.fromAddress ?? '',
        amount: tx.amount,
        isMine: tx.type === 'send',
      },
    ],
    outputs: [
      {
        address:
          tx.type === 'send' ? tx.toAddress ?? '' : account.xpubOrAddress,
        amount: tx.amount,
        isMine: tx.type === 'receive',
      },
    ],
  };

  return transaction;
};

const isTransactionInDatabase = async (
  db: IDatabase,
  accountId: string,
  transactionHash: string,
): Promise<boolean> => {
  const existingTransaction = await db.transaction.getOne({
    accountId,
    hash: transactionHash,
  });

  return !!existingTransaction;
};

const fetchNewTransactions = async (params: {
  account: IAccount;
  db: IDatabase;
  pageSize: number;
}): Promise<{
  transactions: ITransaction[];
  newLastConfirmedHash?: string;
}> => {
  const { account, db, pageSize } = params;
  const address = account.xpubOrAddress;
  const accountId = account.__id ?? '';

  const siaAccount = account as ISiaAccount;
  const lastConfirmedHash = siaAccount.extraData?.lastConfirmedHash ?? '';

  const allTransactions: services.ISiaTransactionHistory[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await services.getTransactions(
      address,
      pageSize,
      offset,
      lastConfirmedHash,
    );
    allTransactions.push(...response.transactions);

    hasMore = response.hasMore;
    if (hasMore) offset += pageSize;
  }

  allTransactions.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  let newLastConfirmedHash = lastConfirmedHash;

  for (let i = 0; i < allTransactions.length; i += 1) {
    const currentTx = allTransactions[i];
    if (currentTx.confirmations >= 1) {
      newLastConfirmedHash = currentTx.id;
    } else {
      break;
    }
  }

  const newTransactions: ITransaction[] = [];
  const updatedTransactions: ITransaction[] = [];

  for (const tx of allTransactions) {
    const existsInDb = await isTransactionInDatabase(db, accountId, tx.id);

    if (existsInDb) {
      const parsedTx = parseTransaction(tx, account);
      updatedTransactions.push(parsedTx);
    } else {
      newTransactions.push(parseTransaction(tx, account));
    }
  }

  return {
    transactions: [...newTransactions, ...updatedTransactions],
    newLastConfirmedHash,
  };
};

const getAddressDetails: IGetAddressDetails<{
  updatedBalance?: string;
  lastConfirmedHash?: string;
}> = async ({ db, account, iterationContext }) => {
  const siaAccount = account as ISiaAccount;
  const address = account.xpubOrAddress;

  const updatedBalance =
    iterationContext?.updatedBalance ?? (await services.getBalance(address));

  const { transactions, newLastConfirmedHash } = await fetchNewTransactions({
    account,
    db,
    pageSize: PER_PAGE_TXN_LIMIT,
  });

  const updatedAccountInfo: Partial<ISiaAccount> = {
    balance: updatedBalance,
    spendableBalance: updatedBalance,
    extraData: {
      ...siaAccount.extraData,
      lastConfirmedHash: newLastConfirmedHash,
    },
  };

  return {
    hasMore: false,
    nextIterationContext: {
      updatedBalance,
      lastConfirmedHash: newLastConfirmedHash,
    },
    transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncSiaAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
