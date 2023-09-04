import {
  IBalanceHistory,
  IGetAccountHistoryResult,
} from '@cypherock/coin-support-interfaces';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  IAccount,
  IDatabase,
  IPriceHistory,
  ITransaction,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ICreateGetAccountHistoryParams } from './types';

import { convertToUnit, getDefaultUnit, getZeroUnit } from '../unit';
import logger from '../utils/logger';

export * from './types';

async function getAccount(
  accountInParams: IAccount | undefined,
  db: IDatabase,
  accountId: string,
) {
  if (accountInParams) {
    return accountInParams;
  }

  return (await db.account.getOne({ __id: accountId })) as IAccount;
}

async function getTransactions(
  allTransactions: ITransaction[] | undefined,
  account: IAccount,
  db: IDatabase,
) {
  if (allTransactions) {
    return allTransactions
      .filter(t => t.accountId === account.__id)
      .sort((t1, t2) => t1.timestamp - t2.timestamp);
  }

  return db.transaction.getAll(
    { accountId: account.__id },
    { sortBy: { key: 'timestamp', descending: false } },
  );
}

async function getPriceHistory(
  allPriceHistories: IPriceHistory[] | undefined,
  account: IAccount,
  currency: string,
  days: number,
  db: IDatabase,
) {
  let priceHistory: IPriceHistory | undefined;

  if (allPriceHistories) {
    priceHistory = allPriceHistories.find(
      p =>
        p.assetId === account.assetId &&
        p.currency === currency &&
        p.days === days,
    );
  } else {
    priceHistory = await db.priceHistory.getOne({
      assetId: account.assetId,
      currency,
      days,
    });
  }

  if (!priceHistory) {
    throw new Error('Price history not found');
  }

  return priceHistory.history.sort((a, b) => a.timestamp - b.timestamp);
}

export async function createGetAccountHistory(
  params: ICreateGetAccountHistoryParams,
): Promise<IGetAccountHistoryResult> {
  const {
    db,
    accountId,
    priceHistories: allPriceHistories,
    transactions: allTransactions,
    account: accountInParams,
    currency,
    days,
  } = params;

  const account = await getAccount(accountInParams, db, accountId);
  const transactions = await getTransactions(allTransactions, account, db);
  const priceHistory = await getPriceHistory(
    allPriceHistories,
    account,
    currency,
    days,
    db,
  );

  let curBalance = new BigNumber(account.balance);

  const accountBalanceHistory: IBalanceHistory[] = priceHistory.map(e => ({
    balance: '0',
    value: '0',
    timestamp: e.timestamp,
  }));

  const zeroUnit = getZeroUnit(account.assetId);
  const defaultUnit = getDefaultUnit(account.assetId);

  for (
    let tIndex = transactions.length - 1, pIndex = priceHistory.length - 1;
    pIndex > 0;
    pIndex -= 1
  ) {
    const isFirst = pIndex === priceHistory.length - 1;
    const transaction = transactions[tIndex] as ITransaction | undefined;
    let isTxnAdded = false;
    if (transaction && (transaction.confirmations ?? 0) > 0) {
      const transactionTime = new Date(transaction.timestamp).getTime();
      const prevPricePoint = accountBalanceHistory[pIndex - 1].timestamp;
      const thisPricePoint = accountBalanceHistory[pIndex].timestamp;

      if (
        (prevPricePoint < transactionTime &&
          transactionTime <= thisPricePoint) ||
        (isFirst && transactionTime >= thisPricePoint)
      ) {
        if (transaction.type === TransactionTypeMap.send) {
          curBalance = curBalance.plus(new BigNumber(transaction.amount));
          curBalance = curBalance.plus(new BigNumber(transaction.fees));
        } else {
          curBalance = curBalance.minus(new BigNumber(transaction.amount));
        }
        tIndex -= 1;
        isTxnAdded = true;
      }
    }

    (accountBalanceHistory[pIndex] as any).balanceInDefaultUnit = convertToUnit(
      {
        amount: curBalance.toString(),
        coinId: account.assetId,
        fromUnitAbbr: zeroUnit.abbr,
        toUnitAbbr: defaultUnit.abbr,
      },
    ).amount;
    accountBalanceHistory[pIndex].balance = curBalance.toString();
    accountBalanceHistory[pIndex].value = new BigNumber(
      convertToUnit({
        amount: curBalance.toString(),
        coinId: account.assetId,
        fromUnitAbbr: zeroUnit.abbr,
        toUnitAbbr: defaultUnit.abbr,
      }).amount,
    )
      .multipliedBy(priceHistory[pIndex].price)
      .toString();

    if (isTxnAdded) {
      pIndex += 1;
    }
  }

  // accountBalanceHistory[0].balance = curBalance.toString();

  const hasNegative = accountBalanceHistory.some(a =>
    new BigNumber(a.balance).isNegative(),
  );

  if (hasNegative) {
    logger.warn(`Portfolio: Negative value found in ${account.assetId}`, {
      assetId: account.assetId,
      parent: account.parentAssetId,
      days,
    });
  }

  return { history: accountBalanceHistory, account };
}
