import { getParsedAmount } from '@cypherock/coin-support-utils';
import { IAccount } from '@cypherock/db-interfaces';
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
