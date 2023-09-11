import {
  IGetAddressDetails,
  createSyncAccountsObservable,
  getLatestTransactionBlock,
} from '@cypherock/coin-support-utils';
import {
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
} from '@cypherock/db-interfaces';

import { ISyncEvmAccountsParams } from './types';

import {
  getTransactions,
  getBalance,
  mapTransactionsForDb,
  mapInternalTransactionsForDb,
} from '../../services';
import { IEvmAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const fetchAndParseTransactions = async (params: {
  db: IDatabase;
  account: IAccount;
  afterTransactionBlock: number | undefined;
}) => {
  const { db, account, afterTransactionBlock } = params;

  const afterBlock =
    afterTransactionBlock ??
    (await getLatestTransactionBlock(db, {
      accountId: account.__id,
    }));

  const transactionDetails = await getTransactions({
    address: account.xpubOrAddress,
    assetId: account.assetId,
    from: afterBlock,
    limit: PER_PAGE_TXN_LIMIT,
    internal: false,
  });

  const transactions = mapTransactionsForDb({
    account,
    transactions: transactionDetails.result,
  });

  const hasMore = transactionDetails.more;

  const newAfterBlock = Math.max(
    ...transactions
      .filter(t => t.status === TransactionStatusMap.success && t.blockHeight)
      .map(t => t.blockHeight),
  );

  return { hasMore, transactions, afterBlock: newAfterBlock };
};

// TODO: Prevent overriding of transactions
// Example: 0xedda19653fb2b2f1a6282800d62b166066c06642d0090b6b18ec9e512f1a66f5
// It has both normal and internal transaction for our address
const fetchAndParseInternalTransactions = async (params: {
  db: IDatabase;
  account: IAccount;
  updatedAccountInfo: Partial<IAccount>;
  afterInternalTransactionBlock: number | undefined;
}) => {
  const { afterInternalTransactionBlock } = params;
  const account = params.account as IEvmAccount;
  const updatedAccountInfo = params.updatedAccountInfo as IEvmAccount;

  const afterBlock =
    afterInternalTransactionBlock ??
    updatedAccountInfo.extraData.lastInternalTransactionBlockHeight;

  const transactionDetails = await getTransactions({
    address: account.xpubOrAddress,
    assetId: account.assetId,
    from: afterBlock,
    limit: PER_PAGE_TXN_LIMIT,
    internal: true,
  });

  const transactions = mapInternalTransactionsForDb({
    account,
    transactions: transactionDetails.result,
  });

  const hasMore = transactionDetails.more;

  const newAfterBlock = Math.max(
    ...transactions
      .filter(t => t.status === TransactionStatusMap.success && t.blockHeight)
      .map(t => t.blockHeight),
  );

  return { hasMore, transactions, afterBlock: newAfterBlock };
};

const getAddressDetails: IGetAddressDetails<{
  updatedBalance?: string;
  updatedAccountInfo?: Partial<IAccount>;
  afterTransactionBlock?: number;
  afterInternalTransactionBlock?: number;
  hasMoreTransactions?: boolean;
  hasMoreInternalTransactions?: boolean;
}> = async ({ db, account, iterationContext }) => {
  let {
    afterTransactionBlock,
    afterInternalTransactionBlock,
    hasMoreTransactions,
    hasMoreInternalTransactions,
  } = iterationContext ?? {};

  const updatedBalance =
    iterationContext?.updatedBalance ??
    (await getBalance(account.xpubOrAddress, account.assetId));

  const updatedAccountInfo = {
    ...(iterationContext?.updatedAccountInfo ?? {}),
    balance: updatedBalance,
    extraData: {
      ...(account.extraData ?? {}),
    },
  };

  const transactions: ITransaction[] = [];

  if (hasMoreTransactions !== false) {
    const transactionDetails = await fetchAndParseTransactions({
      db,
      account,
      afterTransactionBlock,
    });

    transactions.push(...transactionDetails.transactions);
    hasMoreTransactions = transactionDetails.hasMore;
    afterTransactionBlock = transactionDetails.afterBlock;
  }

  if (hasMoreInternalTransactions !== false) {
    const internalTransactionDetails = await fetchAndParseInternalTransactions({
      db,
      updatedAccountInfo,
      account,
      afterInternalTransactionBlock,
    });

    transactions.push(...internalTransactionDetails.transactions);
    hasMoreInternalTransactions = internalTransactionDetails.hasMore;
    afterInternalTransactionBlock = internalTransactionDetails.afterBlock;
  }

  const hasMore = hasMoreTransactions || hasMoreInternalTransactions;

  return {
    hasMore,
    transactions,
    updatedAccountInfo,
    nextIterationContext: {
      hasMoreTransactions,
      hasMoreInternalTransactions,
      afterInternalTransactionBlock,
      afterTransactionBlock,
      updatedBalance,
      updatedAccountInfo,
    },
  };
};

export const syncAccount = (params: ISyncEvmAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
