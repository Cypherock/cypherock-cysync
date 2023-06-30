import { IWallet } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const Wallet: ITableDetails<Omit<IWallet, BaseFields>> = {
  name: 'wallet',
  schema: {
    name: { type: 'string' },
    hasPin: { type: 'boolean' },
    hasPassphrase: { type: 'boolean' },
    deviceId: { type: 'string' },
  },
};
