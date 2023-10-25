import { getCoinSupport } from '@cypherock/coin-support';
import {
  IBalanceHistory,
  IGetAccountHistoryResult,
} from '@cypherock/coin-support-interfaces';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  IDatabase,
  IAccount,
  ITransaction,
  IPriceHistory,
  IPriceInfo,
} from '@cypherock/db-interfaces';

const timestampOverlapMapInSeconds: Record<number, number> = {
  1: 60,
  7: 60,
  30: 60,
  365: 360 * 60,
};

const getClosestTimestamp = (
  balanceHistory: IGetAccountHistoryResult['history'],
  timestamp: number,
  days: number,
) => {
  if (balanceHistory.length <= 0) {
    return undefined;
  }

  let closestTimestamp: number | undefined;
  let closestTimestampDiff = Number.MAX_SAFE_INTEGER;

  for (const item of balanceHistory) {
    const currentDiff = Math.abs(item.timestamp - timestamp);
    closestTimestampDiff = Math.min(closestTimestampDiff, currentDiff);

    if (closestTimestampDiff === currentDiff) {
      closestTimestamp = item.timestamp;
    }
  }

  if (
    closestTimestampDiff <=
    (timestampOverlapMapInSeconds[days] ?? 1) * 1000
  ) {
    return closestTimestamp;
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

  for (const account of accounts) {
    const coinSupport = getCoinSupport(account.familyId);
    balanceHistoryList.push(
      await coinSupport.getAccountHistory({
        db,
        accountId: account.__id ?? '',
        account,
        currency,
        days,
        priceHistories,
        transactions,
        priceInfos,
      }),
    );
  }

  const allCoinHistoryData: IGetAccountHistoryResult['history'] = [];

  let timestampList = [];
  const baseHistory = balanceHistoryList[0].history;

  for (let i = 1; i < baseHistory.length; i += 1) {
    const allTimestamps = balanceHistoryList.map(b =>
      getClosestTimestamp(b.history, baseHistory[i].timestamp, days),
    );

    if (!allTimestamps.includes(undefined)) {
      timestampList.push(baseHistory[i].timestamp);
    }
  }

  if (baseHistory.length <= 0) {
    timestampList = baseHistory.map(b => b.timestamp);
  }

  for (let i = 0; i < timestampList.length; i += 1) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let j = 0; j < balanceHistoryList.length; j += 1) {
      if (!allCoinHistoryData[i]) {
        allCoinHistoryData[i] = {
          timestamp: timestampList[i],
          balance: '0',
          value: '0',
        };
      }

      const closestTimestamp = getClosestTimestamp(
        balanceHistoryList[j].history,
        timestampList[i],
        days,
      );

      const history = balanceHistoryList[j].history.find(
        h => h.timestamp === closestTimestamp,
      );

      if (assetId || parentAssetId || accountId) {
        allCoinHistoryData[i].balance = new BigNumber(
          allCoinHistoryData[i].balance,
        )
          .plus(history?.balance ?? 0)
          .toString();
      } else {
        allCoinHistoryData[i].balance = '0';
      }

      allCoinHistoryData[i].value = new BigNumber(allCoinHistoryData[i].value)
        .plus(history?.value ?? 0)
        .toString();
    }
  }

  return {
    balanceHistory: allCoinHistoryData,
    totalValue: balanceHistoryList
      .reduce((a, b) => a.plus(b.currentValue), new BigNumber(0))
      .toString(),
  };
};
