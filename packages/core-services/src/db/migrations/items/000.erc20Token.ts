import { getAsset } from '@cypherock/coin-support-utils';
import { coinFamiliesMap, IEvmErc20Token } from '@cypherock/coins';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';

import logger from '../../../utils/logger';
import { IMigration } from '../types';

/**
 * Account DB migration from 0 => 1
 * - Add contract address to ERC20 token account
 */
const migration: IMigration = {
  name: 'ERC20 token extra data contains contract address',
  up: async db => {
    const allAccounts = await db.account.getAll({
      __version: 0,
    });

    for (const account of allAccounts) {
      try {
        const dataToUpdate: Partial<IAccount> = {
          __version: 1,
        };

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
        }

        await db.account.update(
          { __id: account.__id, __version: 0 },
          dataToUpdate,
        );
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
