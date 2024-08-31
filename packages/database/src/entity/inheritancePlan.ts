import { IInheritancePlan } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const InheritancePlan: ITableDetails<
  Omit<IInheritancePlan, BaseFields>
> = {
  name: 'inheritancePlan',
  schema: {
    walletId: { type: 'string' },
    walletName: { type: 'string' },
    type: { type: 'string' },
    isNominee: { type: 'boolean' },
    purchasedAt: { type: 'number', isOptional: true },
    expireAt: { type: 'number', isOptional: true },
  },
};
