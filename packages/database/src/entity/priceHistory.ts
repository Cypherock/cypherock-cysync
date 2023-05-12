import { IPriceHistory } from '@cypherock/db-interfaces';
import { DefaultFields, ITableDetails } from './types';

export const PriceHistory: ITableDetails<Omit<IPriceHistory, DefaultFields>> = {
  name: 'price_history',
  schema: {
    days: { type: 'number' },
    history: { type: 'array' },
    assetId: { type: 'string' },
    currency: { type: 'string' },
  },
};
