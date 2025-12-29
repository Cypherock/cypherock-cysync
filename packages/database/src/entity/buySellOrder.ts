import { IBuySellOrder } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const BuySellOrder: ITableDetails<Omit<IBuySellOrder, BaseFields>> = {
  name: 'buy_sell_order',
  schema: {
    id: { type: 'string' },

    provider: { type: 'string' },

    paymentMethod: { type: 'object' },
    currencyFrom: { type: 'string' },
    amountFrom: { type: 'string' },
    amountTo: { type: 'string' },

    country: { type: 'string' },

    status: { type: 'string' },

    accountId: { type: 'string' },
    walletId: { type: 'string' },
    assetId: { type: 'string' },
    familyId: { type: 'string' },
    parentAssetId: { type: 'string' },

    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
};
