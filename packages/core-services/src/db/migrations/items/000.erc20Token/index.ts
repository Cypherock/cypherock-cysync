import { IEvmAccount } from '@cypherock/coin-support-evm';
import { getAsset } from '@cypherock/coin-support-utils';
import { coinFamiliesMap, IEvmErc20Token } from '@cypherock/coins';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';

import { changedCoins, idChanges } from './idChanges';

import logger from '../../../../utils/logger';
import {
  migrateTokenDetailsChangeInDb,
  migrateTokenIdChangeInDb,
} from '../../helpers';
import { IMigrationItem } from '../../types';

/**
 * Account DB migration
 * - Add contract address to ERC20 token account
 * - Force the refetching of token history
 * - Remove unit from ERC20 token account, so that default can be used
 */
const migration: IMigrationItem = {
  id: '0',
  name: 'ERC20 token account migration',
  up: async db => {
    await migrateTokenIdChangeInDb(db, idChanges);
    await migrateTokenDetailsChangeInDb(db, changedCoins);

    const allAccounts = await db.account.getAll({});

    for (const account of allAccounts) {
      try {
        const dataToUpdate: Partial<IAccount> = {};

        if (
          account.type === AccountTypeMap.subAccount &&
          account.familyId === coinFamiliesMap.evm
        ) {
          const tokenObj = getAsset(
            account.parentAssetId,
            account.assetId,
          ) as IEvmErc20Token;

          dataToUpdate.extraData = {
            ...(account.extraData ?? {}),
            contractAddress: tokenObj.address,
          };
          dataToUpdate.unit = undefined;
        } else if (account.familyId === coinFamiliesMap.evm) {
          (dataToUpdate.extraData as IEvmAccount['extraData']) = {
            ...(account.extraData ?? {}),
            lastContractTransactionBlockHeight: undefined,
          };
        }

        await db.account.update({ __id: account.__id }, dataToUpdate);
      } catch (error) {
        logger.warn(`Error in migrating erc20 token account`, {
          name: migration.name,
        });
        logger.warn(error);
      }
    }
  },
  down: async () => {
    // Not required as of this migration
  },
};

export default migration;
