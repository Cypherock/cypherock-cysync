import { IMigrationItem } from '../../types';

const migration: IMigrationItem = {
  id: '4',
  name: 'Matic to POL migration',
  up: async db => {
    const accounts = await db.account.getAll({
      familyId: 'evm',
      parentAssetId: 'polygon',
    });

    for (const account of accounts) {
      if (account.unit === 'MATIC') {
        await db.account.update(
          { __id: account.__id },
          {
            unit: undefined,
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
