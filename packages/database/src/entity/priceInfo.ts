import { IPriceInfo } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const PriceInfo: ITableDetails<Omit<IPriceInfo, BaseFields>> = {
  name: 'price_info',
  schema: {
    currency: { type: 'string' },
    latestPrice: { type: 'string' },
    assetId: { type: 'string' },
    lastSyncedAt: { type: 'number' },
  },
};
