import { changedCoins } from './idChanges';

import { migrateTokenDetailsChangeInDb } from '../../helpers';
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
  },
  down: async () => {
    // Not required as of this migration
  },
};

export default migration;
