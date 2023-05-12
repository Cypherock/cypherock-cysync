import { IPriceInfo } from '@cypherock/db-interfaces';
import { DefaultFields, ITableDetails } from './types';

export const PriceInfo: ITableDetails<Omit<IPriceInfo, DefaultFields>> = {
  name: 'price_info',
  schema: {
    currency: { type: 'string' },
    latestPrice: { type: 'string' },
    assetId: { type: 'string' },
  },
};
