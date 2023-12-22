import {
  IGetAddressDetails,
  createSyncAccountsObservable,
  getLatestTransactionBlock,
  createSyncPricesObservable,
  createSyncPriceHistoriesObservable,
} from '@cypherock/coin-support-utils';
import {
  AccountTypeMap,
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
} from '@cypherock/db-interfaces';
import { lastValueFrom } from 'rxjs';

import { ISyncEvmAccountsParams } from './types';

import {
  getTransactions,
  getBalance,
  mapTransactionsForDb,
  mapInternalTransactionsForDb,
  getContractTransactions,
  mapContractTransactionsForDb,
  getContractBalance,
} from '../../services';
import logger from '../../utils/logger';
import { IEvmAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const onNewAccounts = (newAccounts: IAccount[], db: IDatabase) => {
  for (const newAccount of newAccounts) {
    lastValueFrom(
      syncAccount({
        db,
        accountId: newAccount.__id ?? '',
      }),
    ).catch(error => {
      logger.error('Error in syncing evm token account');
      logger.error(error);
    });
  }

  if (newAccounts.length > 0) {
    const getCoinIds = async () =>
      newAccounts.map(e => ({
        parentAssetId: e.parentAssetId,
        assetId: e.assetId,
      }));

    lastValueFrom(
      createSyncPricesObservable({
        db,
        getCoinIds,
      }),
    ).catch(error => {
      logger.error('Error in syncing evm token prices');
      logger.error(error);
    });

    lastValueFrom(
      createSyncPriceHistoriesObservable({
        db,
        getCoinIds,
      }),
    ).catch(error => {
      logger.error('Error in syncing evm token price histories');
      logger.error(error);
    });
  }
};

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
    0,
  );

  return { hasMore, transactions, afterBlock: newAfterBlock };
};

const fetchAndParseInternalTransactions = async (params: {
  db: IDatabase;
  account: IAccount;
  updatedAccountInfo: Partial<IAccount>;
  afterInternalTransactionBlock: number | undefined;
  existingTransactions: ITransaction[];
}) => {
  const { afterInternalTransactionBlock, existingTransactions } = params;
  const account = params.account as IEvmAccount;
  const updatedAccountInfo = params.updatedAccountInfo as IEvmAccount;

  const afterBlock =
    afterInternalTransactionBlock ??
    updatedAccountInfo.extraData.lastInternalTransactionBlockHeight ??
    undefined;

  const transactionDetails = await getTransactions({
    address: account.xpubOrAddress,
    assetId: account.parentAssetId,
    from: afterBlock,
    limit: PER_PAGE_TXN_LIMIT,
    internal: true,
  });

  const transactions = mapInternalTransactionsForDb({
    account,
    transactions: transactionDetails.result,
    existingTransactions,
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

const fetchAndParseContractTransactions = async (params: {
  db: IDatabase;
  account: IAccount;
  updatedAccountInfo: Partial<IAccount>;
  afterContractTransactionBlock: number | undefined;
  existingTransactions: ITransaction[];
}) => {
  const { db, afterContractTransactionBlock, existingTransactions } = params;
  const account = params.account as IEvmAccount;
  const updatedAccountInfo = params.updatedAccountInfo as IEvmAccount;

  const afterBlock =
    afterContractTransactionBlock ??
    updatedAccountInfo.extraData.lastContractTransactionBlockHeight ??
    undefined;

  const transactionDetails = await getContractTransactions({
    address: account.xpubOrAddress,
    assetId: account.parentAssetId,
    from: afterBlock,
    limit: PER_PAGE_TXN_LIMIT,
  });

  const { transactions, newAccounts } = await mapContractTransactionsForDb({
    account,
    transactions: transactionDetails.result,
    db,
    existingTransactions,
  });

  const hasMore = transactionDetails.more;

  const newAfterBlock = Math.max(
    ...transactions
      .filter(t => t.status === TransactionStatusMap.success && t.blockHeight)
      .map(t => t.blockHeight),
    0,
  );

  onNewAccounts(newAccounts, db);

  return { hasMore, transactions, afterBlock: newAfterBlock };
};

const getAddressDetails: IGetAddressDetails<{
  transactionsTillNow?: ITransaction[];
  updatedBalance?: string;
  updatedAccountInfo?: Partial<IEvmAccount>;
  afterTransactionBlock?: number;
  hasMoreTransactions?: boolean;
  afterInternalTransactionBlock?: number;
  hasMoreInternalTransactions?: boolean;
  afterContractTransactionBlock?: number;
  hasMoreContractTransactions?: boolean;
  fetchingMode?: 'transaction' | 'internalTransaction' | 'contractTransaction';
}> = async ({ db, account, iterationContext }) => {
  let {
    afterTransactionBlock,
    afterInternalTransactionBlock,
    hasMoreTransactions,
    hasMoreInternalTransactions,
    hasMoreContractTransactions,
    afterContractTransactionBlock,
    fetchingMode,
    transactionsTillNow,
  } = iterationContext ?? {};

  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  let updatedBalance = iterationContext?.updatedBalance;

  if (isTokenAccount && !updatedBalance) {
    updatedBalance = await getContractBalance(
      account.xpubOrAddress,
      account.parentAssetId,
      account.assetId,
    );
  } else if (!updatedBalance) {
    updatedBalance = await getBalance(
      account.xpubOrAddress,
      account.parentAssetId,
    );
  }

  if (!transactionsTillNow) {
    transactionsTillNow = await db.transaction.getAll({
      accountId: account.__id,
    });
  }

  const updatedAccountInfo: Partial<IEvmAccount> = {
    ...(iterationContext?.updatedAccountInfo ?? {}),
    balance: updatedBalance,
    extraData: {
      ...(account.extraData ?? {}),
    },
  };

  const transactions: ITransaction[] = [];

  if (
    !isTokenAccount &&
    hasMoreTransactions !== false &&
    ['transaction', undefined].includes(fetchingMode)
  ) {
    const transactionDetails = await fetchAndParseTransactions({
      db,
      account,
      afterTransactionBlock,
    });

    transactions.push(...transactionDetails.transactions);
    hasMoreTransactions = transactionDetails.hasMore;
    afterTransactionBlock = transactionDetails.afterBlock;

    fetchingMode = 'transaction';
    if (!hasMoreTransactions) {
      fetchingMode = 'internalTransaction';
    }

    if (transactionsTillNow) {
      transactionsTillNow.push(...transactions);
    }
  }

  if (
    !isTokenAccount &&
    hasMoreInternalTransactions !== false &&
    fetchingMode === 'internalTransaction'
  ) {
    const internalTransactionDetails = await fetchAndParseInternalTransactions({
      db,
      updatedAccountInfo,
      account,
      afterInternalTransactionBlock,
      existingTransactions: transactionsTillNow ?? [],
    });

    transactions.push(...internalTransactionDetails.transactions);
    hasMoreInternalTransactions = internalTransactionDetails.hasMore;
    afterInternalTransactionBlock = internalTransactionDetails.afterBlock;
    (
      updatedAccountInfo as IEvmAccount
    ).extraData.lastInternalTransactionBlockHeight =
      afterInternalTransactionBlock;

    fetchingMode = 'internalTransaction';
    if (!hasMoreInternalTransactions) {
      fetchingMode = 'contractTransaction';
    }
  }

  if (
    !isTokenAccount &&
    hasMoreContractTransactions !== false &&
    fetchingMode === 'contractTransaction'
  ) {
    const contractTransactionDetails = await fetchAndParseContractTransactions({
      db,
      updatedAccountInfo,
      account,
      afterContractTransactionBlock,
      existingTransactions: transactionsTillNow ?? [],
    });

    transactions.push(...contractTransactionDetails.transactions);
    hasMoreContractTransactions = contractTransactionDetails.hasMore;
    afterContractTransactionBlock = contractTransactionDetails.afterBlock;
    (
      updatedAccountInfo as IEvmAccount
    ).extraData.lastContractTransactionBlockHeight =
      afterContractTransactionBlock;
  }

  const hasMore =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    hasMoreTransactions ||
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    hasMoreInternalTransactions ||
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    hasMoreContractTransactions ||
    false;

  return {
    hasMore,
    transactions,
    updatedAccountInfo,
    nextIterationContext: {
      afterContractTransactionBlock,
      hasMoreContractTransactions,
      hasMoreTransactions,
      hasMoreInternalTransactions,
      afterInternalTransactionBlock,
      afterTransactionBlock,
      updatedBalance,
      updatedAccountInfo,
      fetchingMode,
      transactionsTillNow,
    },
  };
};

export const syncAccount = (params: ISyncEvmAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
