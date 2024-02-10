import { changedCoins } from './idChanges';

import {
  migrateTokenDetailsChangeInDb,
  resetContractTransactionBlockHeight,
} from '../../helpers';
import { IMigrationItem } from '../../types';

/**
 * Account DB migration
 * - Update token details (name, symbol, decimal)
 */
const migration: IMigrationItem = {
  id: '2',
  name: 'ERC20 token account migration',
  up: async db => {
    await migrateTokenDetailsChangeInDb(db, changedCoins);
    await resetContractTransactionBlockHeight(db, migration.name);
  },
  down: async () => {
    // Not required as of this migration
  },
};

export default migration;
