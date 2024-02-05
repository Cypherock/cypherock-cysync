import { assert, isSubset } from '@cypherock/cysync-utils';
import { AccountTypeMap, IAccount, IDatabase } from '@cypherock/db-interfaces';

export async function getAccountAndCoin<T>(
  db: IDatabase,
  coinList: Record<string, T>,
  accountId: string,
) {
  const account = await db.account.getOne({ __id: accountId });

  assert(account, new Error('Account not found'));

  const coin = coinList[account.parentAssetId];

  assert(coin, new Error('Coin not found'));

  let parentAccount: IAccount | undefined;
  if (account.type === AccountTypeMap.subAccount)
    parentAccount = await db.account.getOne({ __id: account.parentAccountId });

  return { account, coin, parentAccount };
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
  derivationPath: account.derivationPath,
  derivationScheme: account.derivationScheme,
});

export const updateAccount = async (
  db: IDatabase,
  id: string,
  account: Partial<IAccount>,
) => {
  const existingAccount = await db.account.getOne({ __id: id });

  if (existingAccount) {
    if (isSubset(account, existingAccount)) return;
    await db.account.update({ __id: existingAccount.__id }, account);
  }
};

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

export const hideAccount = async (db: IDatabase, account: IAccount) => {
  if (account.__id === undefined) return;
  await updateAccount(db, account.__id, { ...account, isHidden: true });
};

export const unhideOrInsertAccountIfNotExists = async (
  db: IDatabase,
  account: IAccount,
): Promise<{ account: IAccount; isInserted: boolean; isUnHidden: boolean }> => {
  const query: Partial<IAccount> = getUniqueAccountQuery(account);

  const existingAccount = await db.account.getOne(query);

  if (!existingAccount) {
    return {
      account: await db.account.insert(account),
      isInserted: true,
      isUnHidden: false,
    };
  }

  if (existingAccount.isHidden) {
    const updatedAccounts = await db.account.update(
      { __id: existingAccount.__id },
      { isHidden: false },
    );
    return {
      account: updatedAccounts[0],
      isInserted: false,
      isUnHidden: true,
    };
  }

  return { account: existingAccount, isInserted: false, isUnHidden: false };
};
