import {
  IBalanceHistory,
  IGetAccountHistoryResult,
} from '@cypherock/coin-support-interfaces';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import {
  AccountTypeMap,
  IAccount,
  IDatabase,
  IPriceHistory,
  IPriceInfo,
  IPriceSnapshot,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import lodash from 'lodash';

import { ICreateGetAccountHistoryParams } from './types';

import { convertToUnit, getDefaultUnit, getZeroUnit } from '../unit';
import logger from '../utils/logger';

export * from './types';

async function getAccount(db: IDatabase | undefined, accountId: string) {
  assert(db, 'Database should be present if no account is given');
  return (await db.account.getOne({ __id: accountId })) as IAccount;
}

async function getTransactions(
  allTransactions: ITransaction[] | undefined,
  account: IAccount,
  db?: IDatabase,
) {
  if (allTransactions) {
    return lodash.orderBy(
      allTransactions.filter(
        t =>
          t.accountId === account.__id &&
          t.status === TransactionStatusMap.success,
      ),
      'timestamp',
      'asc',
    );
  }

  assert(db, 'Database should be present if no transactions is given');
  return db.transaction.getAll(
    { accountId: account.__id, status: TransactionStatusMap.success },
    { sortBy: { key: 'timestamp', descending: false } },
  );
}

async function getPriceHistory(
  allPriceHistories: IPriceHistory[] | undefined,
  account: IAccount,
  currency: string,
  days: 1 | 7 | 30 | 365,
  db?: IDatabase,
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
    assert(db, 'Database should be present if no price history is given');
    history = (
      await db.priceHistory.getOne({
        assetId: account.assetId,
        currency,
        days: daysToFetch,
      })
    )?.history;
  }

  if (!history || history.length === 0) {
    // We don't warn if history is present but with no value because
    // it's not an error case. The price history will be empty for coins
    // which are not supported by our coin API
    if (!history) {
      logger.warn('Price history not found', {
        assetId: account.assetId,
        days,
        currency,
      });
    }

    const mockHistoryDetails: Record<
      number,
      { count: number; interval: number }
    > = {
      30: {
        count: 720,
        interval: 60 * 60 * 1000,
      },
      365: {
        count: 365,
        interval: 24 * 60 * 60 * 1000,
      },
    };

    const startTime = Date.now();

    history = new Array(mockHistoryDetails[daysToFetch ?? 30].count)
      .fill(0)
      .map((_, index) => ({
        price: '0',
        timestamp:
          startTime - index * mockHistoryDetails[daysToFetch ?? 30].interval,
      }))
      .reverse();
  }

  if ([1, 7].includes(days)) {
    const firstTimestamp = history[history.length - 1].timestamp;
    const lastTimestampToStop = firstTimestamp - 24 * days * 60 * 60 * 1000;
    history = history.filter(
      h => h.timestamp < firstTimestamp && h.timestamp > lastTimestampToStop,
    );
  }

  return lodash.orderBy(history, ['timestamp'], ['asc']);
}

async function getLatestPrice(
  allPriceInfos: IPriceInfo[] | undefined,
  account: IAccount,
  currency: string,
  db?: IDatabase,
) {
  let price: string | undefined;

  if (allPriceInfos) {
    price = allPriceInfos.find(
      p => p.assetId === account.assetId && p.currency === currency,
    )?.latestPrice;
  } else {
    assert(db, 'Database should be present if no price info is given');
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
  parentAssetId: string;
  assetId: string;
  price: string;
}) {
  return new BigNumber(
    convertToUnit({
      amount: params.amount.toString(),
      coinId: params.parentAssetId,
      assetId: params.assetId,
      fromUnitAbbr: getZeroUnit(params.parentAssetId, params.assetId).abbr,
      toUnitAbbr: getDefaultUnit(params.parentAssetId, params.assetId).abbr,
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
        if (
          transaction.type === TransactionTypeMap.send ||
          transaction.type === TransactionTypeMap.hidden
        ) {
          curBalance = curBalance.plus(new BigNumber(transaction.amount));
          if (account.type === AccountTypeMap.account) {
            curBalance = curBalance.plus(new BigNumber(transaction.fees));
          }
        } else if (transaction.type === TransactionTypeMap.receive) {
          curBalance = curBalance.minus(new BigNumber(transaction.amount));
        }
        tIndex -= 1;
        isTxnAdded = true;
      }
    }

    accountBalanceHistory[pIndex].balance = curBalance.toString();
    accountBalanceHistory[pIndex].value = calcValue({
      amount: curBalance.toString(),
      parentAssetId: account.parentAssetId,
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
    parentAssetId: account.parentAssetId,
    price: priceHistory[0].price,
  });

  accountBalanceHistory[accountBalanceHistory.length - 1].balance =
    account.balance;
  accountBalanceHistory[accountBalanceHistory.length - 1].value = calcValue({
    amount: account.balance,
    parentAssetId: account.parentAssetId,
    assetId: account.assetId,
    price: latestPrice ?? priceHistory[priceHistory.length - 1].price ?? 0,
  });

  const currentValue = calcValue({
    amount: account.balance,
    parentAssetId: account.parentAssetId,
    assetId: account.assetId,
    price: latestPrice ?? priceHistory[priceHistory.length - 1].price ?? 0,
  });

  accountBalanceHistory.push({
    timestamp: Date.now(),
    balance: account.balance,
    value: currentValue,
  });

  let hasNegative = false;
  for (const accountItem of accountBalanceHistory) {
    hasNegative =
      hasNegative || new BigNumber(accountItem.balance).isNegative();
    accountItem.balance = BigNumber.max(accountItem.balance, 0).toString();
    accountItem.value = BigNumber.max(accountItem.value, 0).toString();
  }

  if (hasNegative) {
    logger.warn(`Portfolio: Negative value found in ${account.assetId}`, {
      assetId: account.assetId,
      parent: account.parentAssetId,
      days,
    });
  }

  return {
    history: accountBalanceHistory,
    account,
    currentValue,
  };
}
