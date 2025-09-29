import { providerData } from './constants';

import { IMigrationItem } from '../../types';

const migration: IMigrationItem = {
  id: '8',
  name: 'Update swap transaction history',
  up: async db => {
    const transactions = await db.transaction.getAll({
      isSwap: true,
    });

    for (const transaction of transactions) {
      const { swapData } = transaction;
      if (!swapData) {
        continue;
      }
      const updatedSwapData = {
        ...swapData,
        providerName: providerData.name,
        providerImageUrl: providerData.imageUrl,
      };
      await db.transaction.update(
        { __id: transaction.__id },
        {
          swapData: updatedSwapData,
        },
      );
    }
  },
  down: async () => {
    // Not required as of this migration
  },
};

export default migration;
