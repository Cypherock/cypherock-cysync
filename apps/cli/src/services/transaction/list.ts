import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { IDatabase, ITransaction } from '@cypherock/db-interfaces';
import colors from 'colors/safe';
import lodash from 'lodash';

import {
  formatAccountNameDisplay,
  getAccountAndWalletFromTransaction,
} from '../helpers';

export interface IListTransactionFlags {
  short?: boolean;
}

const mapTransactionToDisplay = async (
  db: IDatabase,
  transaction: ITransaction,
) => {
  const { account, wallet } = await getAccountAndWalletFromTransaction(
    db,
    transaction,
  );

  const { amount, unit } = getParsedAmount({
    coinId: transaction.parentAssetId,
    assetId: transaction.assetId,
    unitAbbr:
      account.unit ??
      getDefaultUnit(account.parentAssetId, account.assetId).abbr,
    amount: transaction.amount,
  });

  return {
    name: account.name,
    wallet: wallet.name,
    tag: lodash.upperCase(account.derivationScheme),
    amount: `${amount} ${unit.abbr}`,
    type: lodash.upperCase(transaction.type),
    status: lodash.upperCase(transaction.status),
    assetId: account.assetId,
    familyId: account.familyId,
    time: new Date(transaction.timestamp).toLocaleString(),
    hash: transaction.hash,
  };
};

const mapTransactionToShortDisplay = async (
  db: IDatabase,
  transaction: ITransaction,
  index: number,
) => {
  const { account, wallet } = await getAccountAndWalletFromTransaction(
    db,
    transaction,
  );

  const { amount, unit } = getParsedAmount({
    coinId: transaction.parentAssetId,
    assetId: transaction.assetId,
    unitAbbr:
      account.unit ??
      getDefaultUnit(account.parentAssetId, account.assetId).abbr,
    amount: transaction.amount,
  });

  return `${index + 1}. ${formatAccountNameDisplay(account)} (${amount} ${
    unit.abbr
  }) - ${lodash.upperCase(transaction.type)} ${lodash.upperCase(
    transaction.status,
  )}: ${wallet.name}`;
};

export const listTransactions = async (
  db: IDatabase,
  options: { flags: IListTransactionFlags },
) => {
  const transactions = await db.transaction.getAll(
    {},
    {
      sortBy: { key: 'timestamp', descending: true },
    },
  );

  if (transactions.length <= 0) {
    console.log(colors.grey('No transactions found'));
    return;
  }

  if (options.flags.short) {
    const transactionsToDisplay = [];

    for (let i = 0; i < transactions.length; i += 1) {
      const transaction = transactions[i];
      transactionsToDisplay.push(
        await mapTransactionToShortDisplay(db, transaction, i),
      );
    }

    transactionsToDisplay.forEach(w => console.log(w));
  } else {
    const transactionsToDisplay = [];

    for (const transaction of transactions) {
      transactionsToDisplay.push(
        await mapTransactionToDisplay(db, transaction),
      );
    }

    console.table(transactionsToDisplay);
  }
};
