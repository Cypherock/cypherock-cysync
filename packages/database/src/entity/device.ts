import { IDevice } from '@cypherock/db-interfaces';

import { BaseFields, ITableDetails } from './types';

export const Device: ITableDetails<Omit<IDevice, BaseFields>> = {
  name: 'device',
  schema: {
    serial: { type: 'string' },
    isAuthenticated: { type: 'boolean' },
    version: { type: 'string' },
  },
};
