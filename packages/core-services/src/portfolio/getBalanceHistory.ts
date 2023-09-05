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
} from '@cypherock/db-interfaces';

const getAccounts = (params: {
  allAccounts: IAccount[];
  accountId?: string;
  assetId?: string;
  walletId?: string;
}) => {
  const { allAccounts, accountId, assetId, walletId } = params;

  return allAccounts.filter(a => {
    let match = true;
    if (accountId) {
      match = a.__id === accountId;
    }
    if (assetId) {
      match = match && a.assetId === assetId;
    }
    if (walletId) {
      match = match && a.walletId === walletId;
    }

    return match;
  });
};

export const getBalanceHistory = async (params: {
  db: IDatabase;
  days: 1 | 7 | 30 | 365;
  currency: string;
  accountId?: string;
  assetId?: string;
  walletId?: string;
  accounts: IAccount[];
  transactions: ITransaction[];
  priceHistories: IPriceHistory[];
}): Promise<IBalanceHistory[]> => {
  const {
    db,
    days,
    assetId,
    accountId,
    walletId,
    currency,
    accounts: allAccounts,
    transactions,
    priceHistories,
  } = params;
  const balanceHistoryList: IGetAccountHistoryResult[] = [];

  const accounts = getAccounts({
    allAccounts,
    accountId,
    assetId,
    walletId,
  });

  if (accounts.length <= 0) {
    return [];
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
      }),
    );
  }

  const allCoinHistoryData: IGetAccountHistoryResult = JSON.parse(
    JSON.stringify(balanceHistoryList[0]),
  );

  for (let i = 1; i < balanceHistoryList.length; i += 1) {
    for (let j = 0; j < balanceHistoryList[i].history.length; j += 1) {
      if (!allCoinHistoryData.history[j]) continue;

      if (assetId) {
        allCoinHistoryData.history[j].balance = new BigNumber(
          allCoinHistoryData.history[j].balance,
        )
          .plus(balanceHistoryList[i].history[j].balance)
          .toString();
      } else {
        allCoinHistoryData.history[j].balance = '0';
      }

      allCoinHistoryData.history[j].value = new BigNumber(
        allCoinHistoryData.history[j].value,
      )
        .plus(balanceHistoryList[i].history[j].value)
        .toString();
    }
  }

  return allCoinHistoryData.history;
};
