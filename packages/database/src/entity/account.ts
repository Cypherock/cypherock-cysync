import { IAccount } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const Account: ITableDetails<Omit<IAccount, BaseFields>> = {
  name: 'account',
  schema: {
    name: { type: 'string' },
    xpubOrAddress: { type: 'string' },
    balance: { type: 'string' },
    unit: { type: 'string', isOptional: true },
    derivationScheme: { type: 'string', isOptional: true },
    derivationPath: { type: 'string' },
    type: { type: 'string' },
    extraData: { type: 'object', isOptional: true },
    assetId: { type: 'string' },
    familyId: { type: 'string' },
    walletId: { type: 'string' },
    parentAccountId: { type: 'string', isOptional: true },
    parentAssetId: { type: 'string' },
    isHidden: { type: 'boolean', isOptional: true },
  },
};
