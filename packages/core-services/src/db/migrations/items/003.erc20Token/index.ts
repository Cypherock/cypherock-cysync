import { changedCoins, idChanges } from './idChanges';

import {
  migrateTokenDetailsChangeInDb,
  migrateTokenIdChangeInDb,
  resetContractTransactionBlockHeight,
} from '../../helpers';
import { IMigrationItem } from '../../types';

const migration: IMigrationItem = {
  id: '3',
  name: 'ERC20 token list update migration',
  up: async db => {
    await migrateTokenIdChangeInDb(db, idChanges);
    await migrateTokenDetailsChangeInDb(db, changedCoins);
    await resetContractTransactionBlockHeight(db, migration.name);
  },
  down: async () => {
    // Not required as of this migration
  },
};

export default migration;
