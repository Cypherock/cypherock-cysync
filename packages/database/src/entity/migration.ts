import { IMigration } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const Migration: ITableDetails<Omit<IMigration, BaseFields>> = {
  name: 'migration',
  schema: {
    id: { type: 'string' },
    ranAt: { type: 'number' },
    isSuccessful: { type: 'boolean' },
  },
};
