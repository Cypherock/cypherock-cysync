import {
  IBalanceHistory,
  IGetAccountHistoryResult,
} from '@cypherock/coin-support-interfaces';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  IAccount,
  IDatabase,
  IPriceHistory,
  IPriceInfo,
  IPriceSnapshot,
  ITransaction,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import lodash from 'lodash';

import { ICreateGetAccountHistoryParams } from './types';

import { convertToUnit, getDefaultUnit, getZeroUnit } from '../unit';
import logger from '../utils/logger';

export * from './types';

async function getAccount(db: IDatabase, accountId: string) {
  return (await db.account.getOne({ __id: accountId })) as IAccount;
}

async function getTransactions(
  allTransactions: ITransaction[] | undefined,
  account: IAccount,
  db: IDatabase,
) {
  if (allTransactions) {
    return lodash.orderBy(
      allTransactions.filter(t => t.accountId === account.__id),
      'timestamp',
      'asc',
    );
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
  days: 1 | 7 | 30 | 365,
  db: IDatabase,
) {
  let history: IPriceSnapshot[] | undefined;

  let daysToFetch = days;

  if ([1, 7].includes(days)) {
    daysToFetch = 30;
  }

  if (allPriceHistories) {
    history = allPriceHistories.find(
      p =>
        p.assetId === account.assetId &&
        p.currency === currency &&
        p.days === daysToFetch,
    )?.history;
  } else {
    history = (
      await db.priceHistory.getOne({
        assetId: account.assetId,
        currency,
        days: daysToFetch,
      })
    )?.history;
  }

  if (!history) {
    throw new Error('Price history not found');
  }

  if ([1, 7].includes(days)) {
    const firstTimestamp = history[0].timestamp;
    const lastTimestampToStop = firstTimestamp + 24 * days * 60 * 60 * 1000;
    history = history.filter(
      h => h.timestamp > firstTimestamp && h.timestamp < lastTimestampToStop,
    );
  }

  return lodash.orderBy(history, ['timestamp'], ['asc']);
}

async function getLatestPrice(
  allPriceInfos: IPriceInfo[] | undefined,
  account: IAccount,
  currency: string,
  db: IDatabase,
) {
  let price: string | undefined;

  if (allPriceInfos) {
    price = allPriceInfos.find(
      p => p.assetId === account.assetId && p.currency === currency,
    )?.latestPrice;
  } else {
    price = (
      await db.priceInfo.getOne({
        assetId: account.assetId,
        currency,
      })
    )?.latestPrice;
  }

  return price;
}

function calcValue(params: {
  amount: string | BigNumber;
  assetId: string;
  price: string;
}) {
  return new BigNumber(
    convertToUnit({
      amount: params.amount.toString(),
      coinId: params.assetId,
      fromUnitAbbr: getZeroUnit(params.assetId).abbr,
      toUnitAbbr: getDefaultUnit(params.assetId).abbr,
    }).amount,
  )
    .multipliedBy(params.price)
    .toString();
}

export async function createGetAccountHistory(
  params: ICreateGetAccountHistoryParams,
): Promise<IGetAccountHistoryResult> {
  const {
    db,
    accountId,
    priceHistories: allPriceHistories,
    priceInfos: allPriceInfos,
    transactions: allTransactions,
    account: accountInParams,
    currency,
    days,
  } = params;

  const account = accountInParams ?? (await getAccount(db, accountId));
  const transactions = await getTransactions(allTransactions, account, db);
  const priceHistory = await getPriceHistory(
    allPriceHistories,
    account,
    currency,
    days,
    db,
  );
  const latestPrice = await getLatestPrice(
    allPriceInfos,
    account,
    currency,
    db,
  );
  let curBalance = new BigNumber(account.balance);

  const accountBalanceHistory: IBalanceHistory[] = priceHistory.map(e => ({
    balance: '0',
    value: '0',
    timestamp: e.timestamp,
  }));

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
      const prevPricePoint = accountBalanceHistory[pIndex + 1]?.timestamp ?? 0;
      const thisPricePoint = accountBalanceHistory[pIndex].timestamp;

      if (
        (!isFirst &&
          prevPricePoint > transactionTime &&
          transactionTime >= thisPricePoint) ||
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

    accountBalanceHistory[pIndex].balance = curBalance.toString();
    accountBalanceHistory[pIndex].value = calcValue({
      amount: curBalance.toString(),
      assetId: account.assetId,
      price: priceHistory[pIndex].price,
    });

    if (isTxnAdded) {
      pIndex += 1;
    }
  }

  accountBalanceHistory[0].balance = curBalance.toString();
  accountBalanceHistory[0].value = calcValue({
    amount: curBalance.toString(),
    assetId: account.assetId,
    price: priceHistory[0].price,
  });

  accountBalanceHistory[accountBalanceHistory.length - 1].balance =
    account.balance;
  accountBalanceHistory[accountBalanceHistory.length - 1].value = calcValue({
    amount: account.balance,
    assetId: account.assetId,
    price: latestPrice ?? priceHistory[priceHistory.length - 1].price,
  });

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