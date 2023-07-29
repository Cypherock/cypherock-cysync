import { IDatabase, ITransaction } from '@cypherock/db-interfaces';

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
