import { IWallet } from '@cypherock/db-interfaces';
import { DefaultFields, ITableDetails } from './types';

export const Wallet: ITableDetails<Omit<IWallet, DefaultFields>> = {
  name: 'wallet',
  schema: {
    name: { type: 'string' },
    hasPin: { type: 'boolean' },
    hasPassphrase: { type: 'boolean' },
    deviceId: { type: 'string' },
  },
};
