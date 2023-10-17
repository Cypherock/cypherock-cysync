import { ITransactionNotificationClick } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const TransactionNotificationClick: ITableDetails<
  Omit<ITransactionNotificationClick, BaseFields>
> = {
  name: 'transactionNotificationClick',
  schema: {
    transactionId: { type: 'string' },
    isClicked: { type: 'boolean' },
    transactionStatus: { type: 'string' },
  },
};
