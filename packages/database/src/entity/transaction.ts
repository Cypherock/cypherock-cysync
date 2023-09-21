import { ITransaction } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const Transaction: ITableDetails<Omit<ITransaction, BaseFields>> = {
  name: 'transaction',
  schema: {
    hash: { type: 'string' },
    fees: { type: 'string' },
    amount: { type: 'string' },
    status: { type: 'string' },
    type: { type: 'string' },
    timestamp: { type: 'number' },
    blockHeight: { type: 'number' },
    inputs: { type: 'array' },
    outputs: { type: 'array' },
    accountId: { type: 'string' },
    confirmations: { type: 'number', isOptional: true },
    extraData: { type: 'object', isOptional: true },
    assetId: { type: 'string' },
    walletId: { type: 'string' },
    familyId: { type: 'string' },
    parentTransactionId: { type: 'string', isOptional: true },
    parentAccountId: { type: 'string', isOptional: true },
    parentAssetId: { type: 'string' },
    subType: { type: 'string', isOptional: true },
    customId: { type: 'string', isOptional: true },
    description: { type: 'string', isOptional: true },
  },
};
