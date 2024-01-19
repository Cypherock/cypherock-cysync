import { Sha256 } from '@aws-crypto/sha256-browser';
import { isSubset, sleep } from '@cypherock/cysync-utils';
import {
  IDatabase,
  IPriceHistory,
  IPriceInfo,
  ITransaction,
  TransactionStatusMap,
} from '@cypherock/db-interfaces';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import lodash from 'lodash';

export const uniqueTransactionFields = [
  'walletId',
  'hash',
  'type',
  'accountId',
  'assetId',
  'familyId',
  'subType',
  'customId',
];

export const createTransactionId = async (txn: ITransaction) => {
  const uniqueString = uniqueTransactionFields.reduce(
    (a, v) => `${a}-${(txn as any)[v]}`,
    '',
  );

  const hash = new Sha256();
  hash.update(uniqueString);

  return uint8ArrayToHex(await hash.digest()).toLowerCase();
};

export const isSameTransaction = (txn1: ITransaction, txn2: ITransaction) =>
  lodash.eq(
    lodash.pick(txn1, uniqueTransactionFields),
    lodash.pick(txn2, uniqueTransactionFields),
  );

export const insertOrUpdateTransactions = async (
  db: IDatabase,
  transactions: ITransaction[],
  BATCH_SIZE = 100,
) => {
  let currentCount = 0;

  for (const transaction of transactions) {
    currentCount += 1;

    if (currentCount > BATCH_SIZE) {
      await sleep(500);
      currentCount = 0;
    }

    const id = await createTransactionId(transaction);

    const existingTxn = await db.transaction.getOne({ __id: id });
    if (existingTxn) {
      // Ignore already confirmed txns while comparing for subset
      if ((existingTxn.confirmations ?? 0) >= 1) {
        const newTxn = structuredClone(transaction);
        delete newTxn.confirmations;

        if (isSubset(newTxn, existingTxn)) {
          continue;
        }
      }

      await db.transaction.update({ __id: existingTxn.__id }, transaction);
    } else {
      await db.transaction.insert({ ...transaction, __id: id });
    }
  }
};

export const getLatestTransactionBlock = async (
  db: IDatabase,
  query: Partial<ITransaction>,
) => {
  const res = await db.transaction.getOne(
    { ...query, status: TransactionStatusMap.success },
    {
      sortBy: {
        key: 'blockHeight',
        descending: true,
      },
      limit: 1,
    },
  );

  if (!res) return undefined;

  return res.blockHeight;
};

export const getLatestTransactionHash = async (
  db: IDatabase,
  query: Partial<ITransaction>,
) => {
  const res = await db.transaction.getOne(query, {
    sortBy: {
      key: 'timestamp',
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
  BATCH_SIZE = 100,
) => {
  let currentCount = 0;

  for (const priceInfo of priceInfos) {
    currentCount += 1;

    if (currentCount > BATCH_SIZE) {
      await sleep(500);
      currentCount = 0;
    }

    const query: Partial<IPriceInfo> = {
      assetId: priceInfo.assetId,
      currency: priceInfo.currency,
    };

    const existingPriceInfo = await db.priceInfo.getOne(query);
    if (existingPriceInfo) {
      if (isSubset(priceInfo, existingPriceInfo)) continue;

      await db.priceInfo.update({ __id: existingPriceInfo.__id }, priceInfo);
    } else {
      await db.priceInfo.insert(priceInfo);
    }
  }
};

export const insertOrUpdatePriceHistory = async (
  db: IDatabase,
  priceHistories: IPriceHistory[],
  BATCH_SIZE = 100,
) => {
  let currentCount = 0;

  for (const priceHistory of priceHistories) {
    currentCount += 1;

    if (currentCount > BATCH_SIZE) {
      await sleep(500);
      currentCount = 0;
    }

    const query: Partial<IPriceHistory> = {
      assetId: priceHistory.assetId,
      currency: priceHistory.currency,
      days: priceHistory.days,
    };

    const existingPriceHistory = await db.priceHistory.getOne(query);
    if (existingPriceHistory) {
      if (isSubset(priceHistory, existingPriceHistory)) continue;

      await db.priceHistory.update(
        { __id: existingPriceHistory.__id },
        priceHistory,
      );
    } else {
      await db.priceHistory.insert(priceHistory);
    }
  }
};
