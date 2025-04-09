import { coinFamiliesMap, coinList } from '@cypherock/coins';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';

import { deleteAccount } from '../../account';
import logger from '../../utils/logger';

const validateAccountDetails = (account: IAccount) => {
  const parentCoin = coinList[account.parentAssetId];
  if (!parentCoin) {
    logger.warn(
      `Invalid parentAsset:- ${account.parentAssetId} found for account:- ${account.__id}`,
    );
    return false;
  }

  if (account.parentAssetId !== account.assetId) {
    const coin = (coinList[account.parentAssetId] as any).tokens[
      account.assetId
    ];
    if (!coin) {
      logger.warn(
        `Invalid Asset:- ${account.assetId} found for account:- ${account.__id}`,
      );
      return false;
    }
  }

  const coinFamily = (coinFamiliesMap as any)[account.familyId];
  if (!coinFamily) {
    logger.warn(
      `Invalid Family:- ${account.familyId} found for account:- ${account.__id}`,
    );
    return false;
  }

  return true;
};

export const checkAccountIntegrity = async (database: IDatabase) => {
  const accounts = await database.account.getAll();
  const invalidAccounts = accounts.filter(
    account => !validateAccountDetails(account),
  );

  for (const account of invalidAccounts) {
    logger.warn(`Deleting Account ${account.__id}`);
    await deleteAccount(database, account);
  }
};
