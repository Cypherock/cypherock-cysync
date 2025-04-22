const { getCoinSupport } = require('@cypherock/coin-support');
import {
  IBalanceHistory,
  IGetAccountHistoryResult,
} from '@cypherock/coin-support-interfaces';
import { assert, BigNumber, PromiseQueue } from '@cypherock/cysync-utils';
import {
  IDatabase,
  IAccount,
  ITransaction,
  IPriceHistory,
  IPriceInfo,
} from '@cypherock/db-interfaces';

const getClosestTimestamps = (
  sortedBalanceHistory: IGetAccountHistoryResult['history'],
  timestamp: number,
): [number, number] | undefined => {
  if (sortedBalanceHistory.length <= 0) {
    return undefined;
  }

  if (sortedBalanceHistory.find(h => h.timestamp === timestamp)) {
    return [timestamp, timestamp];
  }

  for (let i = 1; i < sortedBalanceHistory.length; i += 1) {
    const prevItem = sortedBalanceHistory[i - 1];
    const currItem = sortedBalanceHistory[i];

    assert(
      prevItem.timestamp <= currItem.timestamp,
      'Balance History is not sorted in ascending order',
    );

    if (prevItem.timestamp < timestamp && timestamp < currItem.timestamp) {
      return [prevItem.timestamp, currItem.timestamp];
    }
  }

  return undefined;
};

const getAccounts = (params: {
  allAccounts: IAccount[];
  accountId?: string;
  assetId?: string;
  parentAssetId?: string;
  walletId?: string;
}) => {
  const { allAccounts, accountId, assetId, parentAssetId, walletId } = params;
  return allAccounts.filter(a => {
    let match = true;
    if (accountId) {
      match = a.__id === accountId;
    }
    if (assetId) {
      match = match && a.assetId === assetId;
    }
    if (parentAssetId) {
      match = match && a.parentAssetId === parentAssetId;
    }
    if (walletId) {
      match = match && a.walletId === walletId;
    }
    return match;
  });
};

export const getBalanceHistory = async (params: {
  db?: IDatabase;
  days: 1 | 7 | 30 | 365;
  currency: string;
  accountId?: string;
  assetId?: string;
  parentAssetId?: string;
  walletId?: string;
  accounts: IAccount[];
  transactions: ITransaction[];
  priceHistories: IPriceHistory[];
  priceInfos: IPriceInfo[];
}): Promise<{ balanceHistory: IBalanceHistory[]; totalValue: string }> => {
  const {
    db,
    days,
    assetId,
    parentAssetId,
    accountId,
    walletId,
    currency,
    accounts: allAccounts,
    transactions,
    priceHistories,
    priceInfos,
  } = params;

  const balanceHistoryList: IGetAccountHistoryResult[] = [];
  const accounts = getAccounts({
    allAccounts,
    accountId,
    assetId,
    parentAssetId,
    walletId,
  });

  if (accounts.length <= 0) {
    return { balanceHistory: [], totalValue: '0' };
  }

  const tasks = accounts.map(account => () => {
    const coinSupport = getCoinSupport(account.familyId);
    return coinSupport.getAccountHistory({
      db,
      accountId: account.__id ?? '',
      account,
      currency,
      days,
      priceHistories,
      transactions,
      priceInfos,
    });
  });

  const queue = new PromiseQueue<IGetAccountHistoryResult>({
    tasks,
    concurrentCount: 10,
    onNext: result => {
      balanceHistoryList.push(result);
    },
    onError: error => {
      console.error(error);
    },
    onComplete: () => {},
  });

  await queue.run();

  balanceHistoryList.forEach(balanceHistory => {
    balanceHistory.history.sort((a, b) => a.timestamp - b.timestamp);
  });

  if (balanceHistoryList.length === 0 || !balanceHistoryList[0].history) {
    return { balanceHistory: [], totalValue: '0' };
  }

  const allCoinHistoryData: IGetAccountHistoryResult['history'] = [];
  const baseHistory = balanceHistoryList[0].history;
  const timestampList = baseHistory.map(b => b.timestamp);

  for (let i = 0; i < timestampList.length; i += 1) {
    let allCoinValue = new BigNumber(0);
    let allCoinBalance = new BigNumber(0);
    let addedAllCoins = true;

    for (let j = 0; j < balanceHistoryList.length; j += 1) {
      const closestTimestamps = getClosestTimestamps(
        balanceHistoryList[j].history,
        timestampList[i],
      );

      if (closestTimestamps === undefined) {
        addedAllCoins = false;
        break;
      }

      const history1 = balanceHistoryList[j].history.find(
        h => h.timestamp === closestTimestamps[0],
      );

      const history2 = balanceHistoryList[j].history.find(
        h => h.timestamp === closestTimestamps[1],
      );

      if (history1 === undefined || history2 === undefined) {
        addedAllCoins = false;
        break;
      }

      const timestampTarget: BigNumber = new BigNumber(timestampList[i]);

      const balance1: BigNumber = new BigNumber(history1.balance);
      const value1: BigNumber = new BigNumber(history1.value);
      const timestamp1: BigNumber = new BigNumber(history1.timestamp);

      const balance2: BigNumber = new BigNumber(history2.balance);
      const value2: BigNumber = new BigNumber(history2.value);
      const timestamp2: BigNumber = new BigNumber(history2.timestamp);

      const timeRange = timestamp2.minus(timestamp1);

      const balanceSlope: BigNumber = timeRange.isZero()
        ? new BigNumber(0)
        : balance2.minus(balance1).dividedBy(timeRange);

      const valueSlope: BigNumber = timeRange.isZero()
        ? new BigNumber(0)
        : value2.minus(value1).dividedBy(timeRange);

      const value = value1.plus(
        valueSlope.multipliedBy(timestampTarget.minus(timestamp1)),
      );
      const balance = balance1.plus(
        balanceSlope.multipliedBy(timestampTarget.minus(timestamp1)),
      );

      allCoinBalance = allCoinBalance.plus(balance);
      allCoinValue = allCoinValue.plus(value);
    }

    if (addedAllCoins) {
      allCoinHistoryData.push({
        timestamp: timestampList[i],
        balance: allCoinBalance.toString(),
        value: allCoinValue.toString(),
      });
    }
  }

  return {
    balanceHistory: allCoinHistoryData,
    totalValue: balanceHistoryList
      .reduce((a, b) => {
        return a.plus(new BigNumber(b.currentValue));
      }, new BigNumber(0))
      .toString(),
  };
};
