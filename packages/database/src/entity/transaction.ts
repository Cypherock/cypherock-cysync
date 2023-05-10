import { ITableDetails } from './types';

export const Transaction: ITableDetails = {
  name: 'transaction',
  schema: {
    hash: { type: 'string' },
    fees: { type: 'string' },
    amount: { type: 'string' },
    status: { type: 'object' },
    type: { type: 'object' },
    timestamp: { type: 'number' },
    blockHeight: { type: 'number' },
    inputs: { type: 'object' },
    outputs: { type: 'object' },
    accountId: { type: 'string' },
    confirmations: { type: 'number', isOptional: true },
    extraData: { type: 'object', isOptional: true },
    parentTransactionId: { type: 'string', isOptional: true },
  },
};
