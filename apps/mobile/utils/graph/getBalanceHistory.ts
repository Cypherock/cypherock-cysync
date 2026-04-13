const { getCoinSupport } = require('@cypherock/coin-support');
import {
  IBalanceHistory,
  IGetAccountHistoryResult,
} from '@cypherock/coin-support-interfaces';
import { BigNumber, PromiseQueue } from '@cypherock/cysync-utils';
import {
  IDatabase,
  IAccount,
  ITransaction,
  IPriceHistory,
  IPriceInfo,
} from '@cypherock/db-interfaces';
import logger from '../logger';

const getClosestTimestamps = (
  sortedHistory: IGetAccountHistoryResult['history'],
  timestamp: number,
): [number, number] | undefined => {
  if (sortedHistory.length === 0) return undefined;

  let lo = 0,
    hi = sortedHistory.length - 1;

  if (sortedHistory[lo].timestamp === timestamp) return [timestamp, timestamp];
  if (sortedHistory[hi].timestamp === timestamp) return [timestamp, timestamp];

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const t = sortedHistory[mid].timestamp;
    if (t === timestamp) return [timestamp, timestamp];
    if (t < timestamp) lo = mid + 1;
    else hi = mid - 1;
  }

  if (hi < 0 || lo >= sortedHistory.length) return undefined;
  return [sortedHistory[hi].timestamp, sortedHistory[lo].timestamp];
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

  const txByAccount = new Map<string, ITransaction[]>();
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    let arr = txByAccount.get(t.accountId);
    if (!arr) {
      arr = [];
      txByAccount.set(t.accountId, arr);
    }
    arr.push(t);
  }

  const priceHistoryByKey = new Map<string, IPriceHistory[]>();
  for (let i = 0; i < priceHistories.length; i++) {
    const p = priceHistories[i];
    const key = `${p.assetId}|${p.currency}`;
    let arr = priceHistoryByKey.get(key);
    if (!arr) {
      arr = [];
      priceHistoryByKey.set(key, arr);
    }
    arr.push(p);
  }

  const priceInfoByKey = new Map<string, IPriceInfo[]>();
  for (let i = 0; i < priceInfos.length; i++) {
    const p = priceInfos[i];
    const key = `${p.assetId}|${p.currency}`;
    let arr = priceInfoByKey.get(key);
    if (!arr) {
      arr = [];
      priceInfoByKey.set(key, arr);
    }
    arr.push(p);
  }

  const tasks = accounts.map(account => () => {
    const coinSupport = getCoinSupport(account.familyId);
    const key = `${account.assetId}|${currency}`;
    return coinSupport.getAccountHistory({
      db,
      accountId: account.__id ?? '',
      account,
      currency,
      days,
      priceHistories: priceHistoryByKey.get(key) ?? [],
      transactions: txByAccount.get(account.__id ?? '') ?? [],
      priceInfos: priceInfoByKey.get(key) ?? [],
    });
  });

  const queue = new PromiseQueue<IGetAccountHistoryResult>({
    tasks,
    concurrentCount: 10,
    onNext: result => {
      balanceHistoryList.push(result);
    },
    onError: error => {
      logger.error(error);
    },
    onComplete: () => {},
  });

  await queue.run();

  balanceHistoryList.forEach(b =>
    b.history.sort((a, b) => a.timestamp - b.timestamp),
  );

  if (balanceHistoryList.length === 0)
    return { balanceHistory: [], totalValue: '0' };

  const parsedHistories = balanceHistoryList.map(b => ({
    currentValue: b.currentValue,
    sortedHistory: b.history,
    historyMap: new Map(
      b.history.map(h => [
        h.timestamp,
        {
          timestamp: h.timestamp,
          bnTimestamp: new BigNumber(h.timestamp),
          bnBalance: new BigNumber(h.balance),
          bnValue: new BigNumber(h.value),
        },
      ]),
    ),
  }));

  const timestampList = parsedHistories[0].sortedHistory.map(b => b.timestamp);

  const allCoinHistoryData: IGetAccountHistoryResult['history'] = [];

  for (let i = 0; i < timestampList.length; i++) {
    const target = timestampList[i];
    let allCoinValue = new BigNumber(0);
    let allCoinBalance = new BigNumber(0);
    let addedAllCoins = true;

    for (let j = 0; j < parsedHistories.length; j++) {
      const { sortedHistory, historyMap } = parsedHistories[j];

      const brackets = getClosestTimestamps(sortedHistory, target);
      if (!brackets) {
        addedAllCoins = false;
        break;
      }

      const h1 = historyMap.get(brackets[0]);
      const h2 = historyMap.get(brackets[1]);
      if (!h1 || !h2) {
        addedAllCoins = false;
        break;
      }

      const timeRange = h2.bnTimestamp.minus(h1.bnTimestamp);
      const valueSlope = timeRange.isZero()
        ? new BigNumber(0)
        : h2.bnValue.minus(h1.bnValue).dividedBy(timeRange);
      const balanceSlope = timeRange.isZero()
        ? new BigNumber(0)
        : h2.bnBalance.minus(h1.bnBalance).dividedBy(timeRange);
      const bnTarget = new BigNumber(target);

      allCoinValue = allCoinValue.plus(
        h1.bnValue.plus(
          valueSlope.multipliedBy(bnTarget.minus(h1.bnTimestamp)),
        ),
      );
      allCoinBalance = allCoinBalance.plus(
        h1.bnBalance.plus(
          balanceSlope.multipliedBy(bnTarget.minus(h1.bnTimestamp)),
        ),
      );
    }

    if (addedAllCoins) {
      allCoinHistoryData.push({
        timestamp: target,
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
