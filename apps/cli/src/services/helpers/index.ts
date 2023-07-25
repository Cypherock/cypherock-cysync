import { IAccount, IDatabase, ITransaction } from '@cypherock/db-interfaces';
import colors from 'colors/safe';
import lodash from 'lodash';

export const getAccountAndWalletFromTransaction = async (
  db: IDatabase,
  transaction: ITransaction,
) => {
  const account = await db.account.getOne({ __id: transaction.accountId });

  if (!account) {
    throw new Error('No account found for the given transaction');
  }

  return { account, wallet: await getWalletFromAccount(db, account) };
};

export const getWalletFromAccount = async (
  db: IDatabase,
  account: IAccount,
) => {
  const wallet = await db.wallet.getOne({ __id: account.walletId });

  if (!wallet) {
    throw new Error('No wallet found for the given account');
  }

  return wallet;
};

export const formatAccountNameDisplay = (account: IAccount) => {
  let tag = '';

  if (account.derivationScheme) {
    const tagName = lodash.upperCase(account.derivationScheme);
    tag = ` [${tagName}]`;
  }

  return `${account.name}${colors.grey(tag)}`;
};
