import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import colors from 'colors/safe';
import lodash from 'lodash';

import { querySelect } from '~/utils';

export const formatAccountDisplay = (account: IAccount) => {
  let tag = '';

  if (account.derivationScheme) {
    const tagName = lodash.upperCase(account.derivationScheme);
    tag = ` [${tagName}]`;
  }

  const { amount, unit } = getParsedAmount({
    coinId: account.parentAssetId,
    assetId: account.assetId,
    unitAbbr:
      account.unit ??
      getDefaultUnit(account.parentAssetId, account.assetId).abbr,
    amount: account.balance,
  });

  return `${account.name}${colors.grey(tag)} (${amount} ${unit.abbr})`;
};

export const queryAccount = async (
  db: IDatabase,
  walletId?: string,
  message = 'Select an account',
) => {
  const accounts = await db.account.getAll({ walletId });

  if (accounts.length <= 0)
    throw new Error('No account found on cli, add accounts first');

  const accountOptions = accounts.map(a => ({
    name: formatAccountDisplay(a),
    value: a,
  }));

  const selectedAccount = await querySelect(accountOptions, message);

  if (!selectedAccount) {
    throw new Error('No account selected');
  }

  return selectedAccount;
};

export const formatAccountNameDisplay = (account: IAccount) => {
  let tag = '';

  if (account.derivationScheme) {
    const tagName = lodash.upperCase(account.derivationScheme);
    tag = ` [${tagName}]`;
  }

  return `${account.name}${colors.grey(tag)}`;
};
