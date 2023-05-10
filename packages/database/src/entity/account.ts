import { ITableDetails } from './types';

export const Account: ITableDetails = {
  name: 'account',
  schema: {
    name: { type: 'string' },
    xpubOrAddress: { type: 'string' },
    balance: { type: 'string' },
    unit: { type: 'string' },
    derivationPath: { type: 'string' },
    type: { type: 'string' },
    extraData: { type: 'object', isOptional: true },
    assetId: { type: 'string' },
    walletId: { type: 'string' },
    parentAccountId: { type: 'string', isOptional: true },
  },
};
