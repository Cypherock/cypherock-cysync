import {
  IGetAddressDetails,
  createSyncAccountsObservable,
  createSyncPriceHistoriesObservable,
  createSyncPricesObservable,
  getLatestTransactionHash,
} from '@cypherock/coin-support-utils';
import { solanaCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  AccountTypeMap,
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
} from '@cypherock/db-interfaces';
import { lastValueFrom } from 'rxjs';

import { ISolanaSplTokenAccount, ISyncSolanaAccountsParams } from './types';

import {
  getTransactions,
  getBalance,
  getTokenBalance,
  getNativeAccountRentExemptFees,
} from '../../services';
import {
  deriveAssociatedTokenAddress,
  mapTokenTransactionsForDb,
  mapTransactionsForDb,
} from '../../utils';
import logger from '../../utils/logger';
import { ISolanaAccount } from '../types';

// Solana transaction are fetched via individual calls, therefore the limit is set relatively low to prevent server timeout.
const PER_PAGE_TXN_LIMIT = 25;

const onNewAccounts = (
  newAccounts: IAccount[],
  db: IDatabase,
  currency: string,
) => {
  for (const newAccount of newAccounts) {
    lastValueFrom(
      syncAccount({
        db,
        accountId: newAccount.__id ?? '',
        currency,
      }),
    ).catch(error => {
      logger.error('Error in syncing tron token account');
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
        currency,
      }),
    ).catch(error => {
      logger.error('Error in syncing tron token prices');
      logger.error(error);
    });

    lastValueFrom(
      createSyncPriceHistoriesObservable({
        db,
        getCoinIds,
        currency,
      }),
    ).catch(error => {
      logger.error('Error in syncing tron token price histories');
      logger.error(error);
    });
  }
};

const fetchAndParseTransactions = async (params: {
  db: IDatabase;
  account: IAccount;
  address: string;
  afterTransactionHash?: string;
  beforeTransactionHash?: string;
  currency: string;
}) => {
  const {
    db,
    account,
    address,
    afterTransactionHash,
    beforeTransactionHash,
    currency,
  } = params;

  const afterHash =
    afterTransactionHash ??
    (await getLatestTransactionHash(db, {
      accountId: account.__id,
      status: TransactionStatusMap.success,
    })) ??
    undefined;

  const transactionDetails = await getTransactions({
    address,
    assetId: account.parentAssetId,
    from: afterHash,
    before: beforeTransactionHash,
    limit: PER_PAGE_TXN_LIMIT,
  });

  const rawTransactions = transactionDetails.data;

  const transactions: ITransaction[] = [];
  const isTokenAccount = account.type === AccountTypeMap.subAccount;

  if (isTokenAccount) {
    const txns = await mapTokenTransactionsForDb(account, rawTransactions);
    transactions.push(...txns);
  } else {
    const { transactions: txns, newAccounts } = await mapTransactionsForDb({
      db,
      account,
      rawTransactions,
    });

    transactions.push(...txns);
    onNewAccounts(newAccounts, db, currency);
  }

  const hasMore = transactionDetails.more;
  const beforeHash = rawTransactions[rawTransactions.length - 1]?.signature;

  const firstTransactionHash = rawTransactions[0]?.signature;

  return { hasMore, transactions, afterHash, beforeHash, firstTransactionHash };
};

const getAddressDetails: IGetAddressDetails<{
  updatedBalance?: string;
  updatedSpendableBalance?: string;
  updatedLatestTransactionHash?: string;
  afterTransactionHash?: string;
  beforeTransactionHash?: string;
}> = async ({ db, account, currency, iterationContext }) => {
  let {
    updatedBalance,
    updatedSpendableBalance,
    updatedLatestTransactionHash,
    afterTransactionHash,
    beforeTransactionHash,
  } = iterationContext ?? {};

  const transactions: ITransaction[] = [];
  let hasMore = false;

  let address = account.xpubOrAddress;

  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    const tokenDetails =
      solanaCoinList[account.parentAssetId].tokens[account.assetId];
    address = deriveAssociatedTokenAddress(
      account.xpubOrAddress,
      tokenDetails.address,
    );

    updatedBalance ??= await getTokenBalance(address, account.parentAssetId);
  } else {
    updatedBalance ??= await getBalance(address, account.parentAssetId);

    updatedSpendableBalance ??= BigNumber.max(
      0,
      new BigNumber(updatedBalance).minus(
        await getNativeAccountRentExemptFees(address, account.assetId),
      ),
    ).toString();
  }

  afterTransactionHash ??= (account as ISolanaAccount | ISolanaSplTokenAccount)
    .extraData.latestTransactionHash;

  const transactionDetails = await fetchAndParseTransactions({
    db,
    account,
    address,
    afterTransactionHash,
    beforeTransactionHash,
    currency,
  });

  transactions.push(...transactionDetails.transactions);
  hasMore = transactionDetails.hasMore;
  afterTransactionHash = transactionDetails.afterHash;
  beforeTransactionHash = transactionDetails.beforeHash;

  updatedLatestTransactionHash ??= transactionDetails.firstTransactionHash;

  const updatedAccountInfo: Partial<ISolanaAccount> = {
    balance: updatedBalance,
    spendableBalance: updatedSpendableBalance,
    extraData: {
      ...account.extraData,
      latestTransactionHash:
        updatedLatestTransactionHash ?? afterTransactionHash,
    },
  };

  return {
    hasMore,
    transactions,
    updatedAccountInfo,
    nextIterationContext: {
      afterTransactionHash,
      beforeTransactionHash,
      updatedBalance,
      updatedSpendableBalance,
      updatedLatestTransactionHash,
    },
  };
};

export const syncAccount = (params: ISyncSolanaAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
