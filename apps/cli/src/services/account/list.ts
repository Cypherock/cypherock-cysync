import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { IDatabase, IAccount } from '@cypherock/db-interfaces';
import colors from 'colors/safe';
import lodash from 'lodash';

import { getWalletFromAccount, formatAccountDisplay } from '../helpers';

export interface IListAccountFlags {
  short?: boolean;
}

const mapAccountToDisplay = async (db: IDatabase, account: IAccount) => {
  const { amount, unit } = getParsedAmount({
    coinId: account.parentAssetId,
    assetId: account.assetId,
    unitAbbr:
      account.unit ??
      getDefaultUnit(account.parentAssetId, account.assetId).abbr,
    amount: account.balance,
  });

  const wallet = await getWalletFromAccount(db, account);

  return {
    name: account.name,
    wallet: wallet.name,
    tag: lodash.upperCase(account.derivationScheme),
    derivationPath: account.derivationPath,
    balance: `${amount} ${unit.abbr}`,
    assetId: account.assetId,
    familyId: account.familyId,
  };
};

const mapAccountToShortDisplay = async (
  db: IDatabase,
  account: IAccount,
  index: number,
) => {
  const wallet = await getWalletFromAccount(db, account);

  return `${index + 1}. ${formatAccountDisplay(account)} - ${wallet.name}`;
};

export const listAccounts = async (
  db: IDatabase,
  options: { flags: IListAccountFlags },
) => {
  const accounts = await db.account.getAll();

  if (accounts.length <= 0) {
    console.log(colors.grey('No accounts found'));
    return;
  }

  if (options.flags.short) {
    const accountsToDisplay = [];

    for (let i = 0; i < accounts.length; i += 1) {
      const account = accounts[i];
      accountsToDisplay.push(await mapAccountToShortDisplay(db, account, i));
    }

    accountsToDisplay.forEach(w => console.log(w));
  } else {
    const accountsToDisplay = [];

    for (const account of accounts) {
      accountsToDisplay.push(await mapAccountToDisplay(db, account));
    }

    console.table(accountsToDisplay);
  }
};
