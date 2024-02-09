import { IEvmAccount } from '@cypherock/coin-support-evm';
import { coinFamiliesMap } from '@cypherock/coins';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';

import logger from '../../../utils/logger';
import { IMigrationItem } from '../types';

export const resetContractTransactionBlockHeight = async (
  db: IDatabase,
  migrationName: IMigrationItem['name'],
) => {
  const allAccounts = await db.account.getAll({});

  for (const account of allAccounts) {
    try {
      if (account.familyId === coinFamiliesMap.evm) {
        const dataToUpdate: Partial<IAccount> = {};
        (dataToUpdate.extraData as IEvmAccount['extraData']) = {
          ...(account.extraData ?? {}),
          lastContractTransactionBlockHeight: undefined,
        };
        await db.account.update({ __id: account.__id }, dataToUpdate);
      }
    } catch (error) {
      logger.warn('Contract Transaction Block Height: Reset Failed', {
        assetId: account.assetId,
        migration: migrationName,
      });
      logger.warn(error);
    }
  }
};
