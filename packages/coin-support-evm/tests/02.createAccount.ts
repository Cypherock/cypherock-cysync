import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, test } from '@jest/globals';
import { EvmSupport } from '../src';

describe('02. Create Account', () => {
  let support: EvmSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;

  beforeEach(() => {
    support = new EvmSupport();
    connection = {} as any;
    db = {
      account: {
        getAll: () => [],
      },
    } as any;
  });

  test('should be able to create accounts', async () => {
    const accounts = await support.createAccounts({
      connection,
      db,
      coinId: 'ethereum',
      walletId: '1243',
    });

    expect(accounts).toBeDefined();
    expect(accounts.length).toBeGreaterThan(0);
  });
});
