import {
  IGetAddressDetails,
  createSyncAccountsObservable,
  getLatestTransactionHash,
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
  afterTransactionHash?: string;
  beforeTransactionHash?: string;
}) => {
  const { db, account, afterTransactionHash, beforeTransactionHash } = params;

  const afterHash =
    afterTransactionHash ??
    (await getLatestTransactionHash(db, {
      accountId: account.__id,
      status: TransactionStatusMap.success,
    })) ??
    undefined;

  const transactionDetails = await getTransactions({
    address: account.xpubOrAddress,
    assetId: account.parentAssetId,
    from: afterHash,
    before: beforeTransactionHash,
    limit: PER_PAGE_TXN_LIMIT,
  });

  const transactions = mapTransactionsForDb({
    account,
    transactions: transactionDetails.data,
  });

  const hasMore = transactionDetails.more;

  const beforeHash = transactions[transactions.length - 1]?.hash;

  return { hasMore, transactions, afterHash, beforeHash };
};

const getAddressDetails: IGetAddressDetails<{
  transactionsTillNow?: ITransaction[];
  updatedBalance?: string;
  updatedAccountInfo?: Partial<ISolanaAccount>;
  afterTransactionHash?: string;
  beforeTransactionHash?: string;
  hasMoreTransactions?: boolean;
}> = async ({ db, account, iterationContext }) => {
  let {
    afterTransactionHash,
    beforeTransactionHash,
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
      afterTransactionHash,
      beforeTransactionHash,
    });

    transactions.push(...transactionDetails.transactions);
    hasMoreTransactions = transactionDetails.hasMore;
    afterTransactionHash = transactionDetails.afterHash;
    beforeTransactionHash = transactionDetails.beforeHash;

    transactionsTillNow.push(...transactions);
  }

  return {
    hasMore: hasMoreTransactions,
    transactions,
    updatedAccountInfo,
    nextIterationContext: {
      hasMoreTransactions,
      afterTransactionHash,
      beforeTransactionHash,
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
