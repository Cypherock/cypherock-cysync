import { coinFamiliesMap } from '@cypherock/coins';

import { IMigrationItem } from '../../types';

/**
 * Reset solana transaction history migration
 * - Reset solana transaction history to sync token accounts previously transacted with
 */
const migration: IMigrationItem = {
  id: '6',
  name: 'Reset Solana transaction history',
  up: async db => {
    const allSolanaTransactions = await db.transaction.remove({
      familyId: coinFamiliesMap.solana,
    });

    const transactionIdUpdateDetails = [
      {
        repository: db.transactionNotificationRead,
        key: 'transactionId',
      },
      {
        repository: db.transactionNotificationClick,
        key: 'transactionId',
      },
    ];

    for (const { repository, key } of transactionIdUpdateDetails) {
      for (const transaction of allSolanaTransactions) {
        await repository.remove({ [key]: transaction.__id });
      }
    }
  },
  down: async () => {
    // Not required as of this migration
  },
};

export default migration;
