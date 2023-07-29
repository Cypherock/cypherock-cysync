import { IDatabase, IAccount } from '@cypherock/db-interfaces';
import colors from 'colors/safe';

import { queryCheckbox } from '~/utils';

import { formatAccountDisplay } from '../helpers';

const queryAccountSelection = async (accounts: IAccount[]) => {
  const list = Object.values(accounts).map(a => ({
    name: formatAccountDisplay(a),
    value: a,
  }));

  return queryCheckbox(list, 'Select accounts you want to remove');
};

export const removeAccount = async (db: IDatabase) => {
  const accounts = await db.account.getAll();

  if (accounts.length <= 0) {
    console.log(colors.grey('No accounts found'));
    return;
  }

  const selectedAccounts = await queryAccountSelection(accounts);

  if (selectedAccounts.length <= 0) {
    console.log(colors.grey('No accounts selected'));
    return;
  }

  for (const account of selectedAccounts) {
    await db.account.remove(account);
    await db.transaction.remove({ accountId: account.__id });
  }
};
