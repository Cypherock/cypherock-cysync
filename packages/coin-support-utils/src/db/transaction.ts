import {
  IDatabase,
  IPriceHistory,
  IPriceInfo,
  ITransaction,
} from '@cypherock/db-interfaces';

export const insertOrUpdateTransactions = async (
  db: IDatabase,
  transactions: ITransaction[],
) => {
  for (const transaction of transactions) {
    const query: Partial<ITransaction> = {
      walletId: transaction.walletId,
      hash: transaction.hash,
      accountId: transaction.accountId,
      assetId: transaction.assetId,
      familyId: transaction.familyId,
    };

    const existingTxn = await db.transaction.getOne(query);
    if (existingTxn) {
      await db.transaction.update({ __id: existingTxn.__id }, transaction);
    } else {
      await db.transaction.insert(transaction);
    }
  }
};

export const getLatestTransactionBlock = async (
  db: IDatabase,
  query: Partial<ITransaction>,
) => {
  const res = await db.transaction.getOne(query, {
    sortBy: {
      key: 'blockHeight',
      descending: true,
    },
    limit: 1,
  });

  if (!res) return undefined;

  return res.blockHeight;
};

export const getLatestTransactionHash = async (
  db: IDatabase,
  query: Partial<ITransaction>,
) => {
  const res = await db.transaction.getOne(query, {
    sortBy: {
      key: 'confirmations',
      descending: true,
    },
    limit: 1,
  });

  if (!res) return undefined;

  return res.hash;
};

export const insertOrUpdatePriceInfo = async (
  db: IDatabase,
  priceInfos: IPriceInfo[],
) => {
  for (const priceInfo of priceInfos) {
    const query: Partial<IPriceInfo> = {
      assetId: priceInfo.assetId,
      currency: priceInfo.currency,
    };

    const existingPriceInfo = await db.priceInfo.getOne(query);
    if (existingPriceInfo) {
      await db.priceInfo.update({ __id: existingPriceInfo.__id }, priceInfo);
    } else {
      await db.priceInfo.insert(priceInfo);
    }
  }
};

export const insertOrUpdatePriceHistory = async (
  db: IDatabase,
  priceHistories: IPriceHistory[],
) => {
  for (const priceHistory of priceHistories) {
    const query: Partial<IPriceHistory> = {
      assetId: priceHistory.assetId,
      currency: priceHistory.currency,
    };

    const existingPriceHistory = await db.priceHistory.getOne(query);
    if (existingPriceHistory) {
      await db.priceHistory.update(
        { __id: existingPriceHistory.__id },
        priceHistory,
      );
    } else {
      await db.priceHistory.insert(priceHistory);
    }
  }
};
