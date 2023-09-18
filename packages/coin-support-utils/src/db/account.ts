import { assert } from '@cypherock/cysync-utils';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';

export async function getAccountAndCoin<T>(
  db: IDatabase,
  coinList: Record<string, T>,
  accountId: string,
) {
  const account = await db.account.getOne({ __id: accountId });

  assert(account, new Error('Account not found'));

  const coin = coinList[account.assetId];

  assert(coin, new Error('Coin not found'));

  return { account, coin };
}

export const getUniqueAccountQuery = (
  account: IAccount,
): Partial<IAccount> => ({
  walletId: account.walletId,
  assetId: account.assetId,
  familyId: account.familyId,
  parentAccountId: account.parentAccountId,
  parentAssetId: account.parentAssetId,
  type: account.type,
});

export const insertOrUpdateAccounts = async (
  db: IDatabase,
  accounts: IAccount[],
) => {
  for (const account of accounts) {
    const query: Partial<IAccount> = getUniqueAccountQuery(account);

    const existingAccount = await db.account.getOne(query);
    if (existingAccount) {
      await db.account.update({ __id: existingAccount.__id }, account);
    } else {
      await db.account.insert(account);
    }
  }
};

export const insertAccountIfNotExists = async (
  db: IDatabase,
  account: IAccount,
): Promise<{ account: IAccount; isInserted: boolean }> => {
  const query: Partial<IAccount> = getUniqueAccountQuery(account);

  const existingAccount = await db.account.getOne(query);

  if (existingAccount) {
    return { account: existingAccount, isInserted: false };
  }

  return { account: await db.account.insert(account), isInserted: true };
};
