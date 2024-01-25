import { IDatabase } from '@cypherock/db-interfaces';

export const setDBVersions = (database: IDatabase) => {
  database.wallet.setVersion(0);
  database.account.setVersion(0);
  database.device.setVersion(0);
  database.priceInfo.setVersion(0);
  database.priceHistory.setVersion(0);
  database.transaction.setVersion(0);
  database.transactionNotificationClick.setVersion(0);
  database.transactionNotificationRead.setVersion(0);
  database.migration.setVersion(0);
};
