import { ITableDetails } from './types';

export const PriceHistory: ITableDetails = {
  name: 'price_history',
  schema: {
    days: { type: 'number' },
    history: { type: 'object' },
    priceInfoId: { type: 'string' },
    assetId: { type: 'string' },
    currency: { type: 'string' },
  },
};
