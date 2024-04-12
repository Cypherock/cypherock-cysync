import { IDatabase } from '@cypherock/db-interfaces';

export const db: IDatabase = {
  account: {
    getAll: jest.fn(() => []),
  },
} as any;
