import { IPriceHistory } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const PriceHistory: ITableDetails<Omit<IPriceHistory, BaseFields>> = {
  name: 'price_history',
  schema: {
    days: { type: 'number' },
    history: { type: 'array' },
    assetId: { type: 'string' },
    currency: { type: 'string' },
  },
};
