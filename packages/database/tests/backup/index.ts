import fs from 'fs';
import path from 'path';

import { sleep } from '@cypherock/cysync-utils';
import { IDatabase, IRepository } from '@cypherock/db-interfaces';

import {
  createGenerator,
  generateDataList,
  IGenerator,
} from './__helpers__/generator';

import { createDb } from '../../src';
import {
  Account,
  Transaction,
  TransactionNotificationRead,
  Migration,
  PriceInfo,
  PriceHistory,
  TransactionNotificationClick,
  Wallet,
  Device,
} from '../../src/entity';

const dbPath = path.join(__dirname, '..', '..', '.tmp');

interface IRepositoryItem {
  name: string;
  repositoryKey: string;
  generator: IGenerator;
  totalInsertions: number;
}

describe.skip('Backup DB test', () => {
  const repositoriesList: IRepositoryItem[] = [
    {
      name: Account.name,
      generator: createGenerator(Account.schema),
      repositoryKey: 'account',
      totalInsertions: 1000,
    },
    {
      name: Transaction.name,
      generator: createGenerator(Transaction.schema),
      repositoryKey: 'transaction',
      totalInsertions: 1000,
    },
    {
      name: TransactionNotificationRead.name,
      generator: createGenerator(TransactionNotificationRead.schema),
      repositoryKey: 'transactionNotificationRead',
      totalInsertions: 1000,
    },
    {
      name: TransactionNotificationClick.name,
      generator: createGenerator(TransactionNotificationClick.schema),
      repositoryKey: 'transactionNotificationClick',
      totalInsertions: 1000,
    },
    {
      name: Wallet.name,
      generator: createGenerator(Wallet.schema),
      repositoryKey: 'wallet',
      totalInsertions: 1000,
    },
    {
      name: Device.name,
      generator: createGenerator(Device.schema),
      repositoryKey: 'device',
      totalInsertions: 1000,
    },
    {
      name: Migration.name,
      generator: createGenerator(Migration.schema),
      repositoryKey: 'migration',
      totalInsertions: 1000,
    },
    {
      name: PriceInfo.name,
      generator: createGenerator(PriceInfo.schema),
      repositoryKey: 'priceInfo',
      totalInsertions: 1000,
    },
    {
      name: PriceHistory.name,
      generator: createGenerator(PriceHistory.schema),
      repositoryKey: 'priceHistory',
      totalInsertions: 1000,
    },
  ];

  describe('Creating database', () => {
    let db: IDatabase;
    beforeAll(async () => {
      if (fs.existsSync(dbPath)) {
        await fs.promises.rm(dbPath, { recursive: true });
      }

      db = await createDb(dbPath);
      await db.load();
    }, 10000);

    afterAll(done => {
      Promise.allSettled([
        db.close(),
        (async () => {
          await sleep(0);
          done();
        })(),
      ]);
    });

    repositoriesList.forEach(item => {
      const { name, totalInsertions, generator, repositoryKey } = item;

      test(`Inserting ${totalInsertions} items into ${name}`, async () => {
        const repository = (db as any)[repositoryKey] as IRepository<any>;

        const items = generateDataList(generator, totalInsertions);
        await repository.insert(items);
      });
    });

    test(`Wait for database to save`, async () => {
      await sleep(5000);
    }, 10000);
  });

  describe('Reading database', () => {
    let db: IDatabase;

    beforeAll(async () => {
      db = await createDb(dbPath);
      await db.load();
    }, 10000);

    afterAll(done => {
      db.close().finally(done);
    }, 10000);

    test(`Some data should exist in backup db`, async () => {
      let totalBackupCollections = 0;
      for (const { totalInsertions, repositoryKey } of repositoriesList) {
        const repository = (db as any)[repositoryKey] as IRepository<any>;

        const allItems = await repository.getAll();
        if (allItems.length === totalInsertions) {
          totalBackupCollections += 1;
        }
      }

      console.log({
        totalBackupCollections,
        totalCorruptedCollections:
          repositoriesList.length - totalBackupCollections,
      });
      expect(totalBackupCollections).toBeGreaterThan(0);
    });
  });
});
