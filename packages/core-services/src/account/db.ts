import { IDatabase, IAccount } from '@cypherock/db-interfaces';

export const deleteAccount = async (db: IDatabase, account: IAccount) => {
  if (account.__id === undefined) {
    return;
  }

  const id = account.__id;

  await db.account.remove({ __id: id });
  await db.account.remove({ parentAccountId: id });
  await db.transaction.remove({ accountId: id });
  await db.transaction.remove({ parentAccountId: id });
};
