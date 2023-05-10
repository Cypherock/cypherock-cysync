import { ITableDetails } from './types';

export const Device: ITableDetails = {
  name: 'device',
  schema: {
    serial: { type: 'string' },
    isAuthenticated: { type: 'boolean' },
    version: { type: 'string' },
  },
};
