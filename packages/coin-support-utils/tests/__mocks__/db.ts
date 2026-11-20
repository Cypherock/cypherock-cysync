import { IDatabase } from '@cypherock/db-interfaces';
import { jest } from '@jest/globals';

export const db: jest.MockedObject<IDatabase> = {
  account: {
    getAll: jest.fn(),
  },
} as any;
