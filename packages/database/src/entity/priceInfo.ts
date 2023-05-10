import { ITableDetails } from './types';

export const PriceInfo: ITableDetails = {
  name: 'price_info',
  schema: {
    currency: { type: 'string' },
    latestPrice: { type: 'string' },
    assetId: { type: 'string' },
  },
};
