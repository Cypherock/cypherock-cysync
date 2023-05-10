import { ITableDetails } from './types';

export const Wallet: ITableDetails = {
  name: 'wallet',
  schema: {
    name: { type: 'string' },
    hasPin: { type: 'boolean' },
    hasPassphrase: { type: 'boolean' },
    deviceId: { type: 'string' },
  },
};
