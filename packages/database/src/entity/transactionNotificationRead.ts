import { ITransactionNotificationRead } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const TransactionNotificationRead: ITableDetails<
  Omit<ITransactionNotificationRead, BaseFields>
> = {
  name: 'transactionNotificationRead',
  schema: {
    transactionId: { type: 'string' },
    transactionStatus: { type: 'string' },
    isRead: { type: 'boolean' },
  },
};
