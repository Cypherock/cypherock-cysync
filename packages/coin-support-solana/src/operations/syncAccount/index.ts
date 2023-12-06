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

import { ISyncSolanaAccountsParams } from './types';

import {
  getTransactions,
  getBalance,
  mapTransactionsForDb,
} from '../../services';
import { ISolanaAccount } from '../types';

// Solana transaction are fetched via individual calls, therefore the limit is set relatively low to prevent server timeout.
const PER_PAGE_TXN_LIMIT = 25;

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
    })) ??
    undefined;

  const transactionDetails = await getTransactions({
    address: account.xpubOrAddress,
    assetId: account.parentAssetId,
    from: afterBlock,
    limit: PER_PAGE_TXN_LIMIT,
  });

  const transactions = mapTransactionsForDb({
    account,
    transactions: transactionDetails.data,
  });

  const hasMore = transactionDetails.more;

  const newAfterBlock = Math.max(
    ...transactions
      .filter(t => t.status === TransactionStatusMap.success && t.blockHeight)
      .map(t => t.blockHeight),
    0,
  );

  return { hasMore, transactions, afterBlock: newAfterBlock };
};

const getAddressDetails: IGetAddressDetails<{
  transactionsTillNow?: ITransaction[];
  updatedBalance?: string;
  updatedAccountInfo?: Partial<ISolanaAccount>;
  afterTransactionBlock?: number;
  hasMoreTransactions?: boolean;
}> = async ({ db, account, iterationContext }) => {
  let {
    afterTransactionBlock,
    hasMoreTransactions,
    transactionsTillNow,
    updatedBalance,
    updatedAccountInfo,
  } = iterationContext ?? {};

  updatedBalance ??= await getBalance(
    account.xpubOrAddress,
    account.parentAssetId,
  );

  transactionsTillNow ??= await db.transaction.getAll({
    accountId: account.__id,
  });

  updatedAccountInfo = {
    ...(updatedAccountInfo ?? {}),
    balance: updatedBalance,
    extraData: { ...(account.extraData ?? {}) },
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

    transactionsTillNow.push(...transactions);
  }

  return {
    hasMore: hasMoreTransactions,
    transactions,
    updatedAccountInfo,
    nextIterationContext: {
      hasMoreTransactions,
      afterTransactionBlock,
      updatedBalance,
      updatedAccountInfo,
      transactionsTillNow,
    },
  };
};

export const syncAccount = (params: ISyncSolanaAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
