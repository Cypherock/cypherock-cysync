import { getParsedAmount } from '@cypherock/coin-support-utils';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import colors from 'colors/safe';
import lodash from 'lodash';

export const formatAccountDisplay = (account: IAccount) => {
  let tag = '';

  if (account.derivationScheme) {
    const tagName = lodash.upperCase(account.derivationScheme);
    tag = ` [${tagName}]`;
  }

  const { amount, unit } = getParsedAmount({
    coinId: account.assetId,
    unitName: account.unit,
    amount: account.balance,
  });

  return `${account.name}${colors.grey(tag)} (${amount} ${unit.abbr})`;
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
