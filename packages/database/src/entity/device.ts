import { IDevice } from '@cypherock/db-interfaces';
import { DefaultFields, ITableDetails } from './types';

export const Device: ITableDetails<Omit<IDevice, DefaultFields>> = {
  name: 'device',
  schema: {
    serial: { type: 'string' },
    isAuthenticated: { type: 'boolean' },
    version: { type: 'string' },
  },
};
