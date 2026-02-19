import { createTransactionId } from '@cypherock/coin-support-utils';

import logger from '../../../../utils/logger';
import { IMigrationItem } from '../../types';

const migration: IMigrationItem = {
  id: '9',
  name: 'Retry transaction id migration safely',
  up: async db => {
    const allTransactions = (await db.transaction.getAll()).map(transaction =>
      JSON.parse(JSON.stringify(transaction)),
    );
    const transactionIdChangesMap: Record<string, string | undefined> = {};

    for (const transaction of allTransactions) {
      try {
        const transactionData = JSON.parse(JSON.stringify(transaction));
        const oldId = transactionData.__id;
        const newId = await createTransactionId(transactionData);

        transactionIdChangesMap[oldId] = newId;

        if (newId === oldId) {
          continue;
        }

        await db.transaction.insert({ ...transactionData, __id: newId });
        await db.transaction.remove({ __id: oldId });
      } catch (error) {
        logger.warn(error);
      }
    }

    for (const transaction of allTransactions) {
      const newId = transactionIdChangesMap[transaction.__id];
      const parentId = transaction.parentTransactionId;

      if (!parentId || !newId) {
        continue;
      }

      const newParentId = transactionIdChangesMap[parentId];

      if (!newParentId) {
        continue;
      }

      await db.transaction.update(
        { __id: newId },
        { parentTransactionId: newParentId },
      );
    }

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
      const allItems = await repository.getAll();
      for (const item of allItems) {
        const newId = transactionIdChangesMap[(item as any)[key]];

        if (!newId) continue;

        await repository.update(
          { __id: item.__id },
          {
            [key]: newId,
          },
        );
      }
    }
  },
  down: async () => {
    // Not required as of this migration
  },
};

export default migration;
