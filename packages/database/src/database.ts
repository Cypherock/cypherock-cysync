import fs from 'fs';
import path from 'path';

import {
  IAccountRepository,
  IDatabase,
  IDevice,
  IDeviceRepository,
  IEntity,
  IPriceHistory,
  IPriceHistoryRepository,
  IPriceInfo,
  IPriceInfoRepository,
  IRepository,
  ITransactionRepository,
  IWallet,
  IWalletRepository,
  ITransactionNotificationClick,
  ITransactionNotificationClickRepository,
  ITransactionNotificationRead,
  ITransactionNotificationReadRepository,
  IMigrationRepository,
  IMigration,
} from '@cypherock/db-interfaces';

import { EncryptedDB } from './encryptedDb';
import {
  Account,
  Device,
  Migration,
  PriceHistory,
  PriceInfo,
  Transaction,
  TransactionNotificationClick,
  TransactionNotificationRead,
  Wallet,
} from './entity';
import {
  AccountRepository,
  Repository,
  TransactionRepository,
} from './repository';

export class Database implements IDatabase {
  private readonly database: EncryptedDB;

  device: IDeviceRepository;

  account: IAccountRepository;

  transaction: ITransactionRepository;

  wallet: IWalletRepository;

  priceHistory: IPriceHistoryRepository;

  priceInfo: IPriceInfoRepository;

  transactionNotificationClick: ITransactionNotificationClickRepository;

  transactionNotificationRead: ITransactionNotificationReadRepository;

  migration: IMigrationRepository;

  constructor(params: {
    database: EncryptedDB;
    device: IDeviceRepository;
    account: IAccountRepository;
    transaction: ITransactionRepository;
    wallet: IWalletRepository;
    priceHistory: IPriceHistoryRepository;
    priceInfo: IPriceInfoRepository;
    transactionNotificationClick: ITransactionNotificationClickRepository;
    transactionNotificationRead: ITransactionNotificationReadRepository;
    migration: IMigrationRepository;
  }) {
    this.database = params.database;

    this.device = params.device;
    this.account = params.account;
    this.transaction = params.transaction;
    this.wallet = params.wallet;
    this.priceHistory = params.priceHistory;
    this.priceInfo = params.priceInfo;
    this.transactionNotificationClick = params.transactionNotificationClick;
    this.transactionNotificationRead = params.transactionNotificationRead;
    this.migration = params.migration;
  }

  public static async create(dirPath: string) {
    const database = await Database.createDb(dirPath);

    const device = await Repository.create<IDevice>(
      database,
      Device.name,
      Device.schema,
    );
    const wallet = await Repository.create<IWallet>(
      database,
      Wallet.name,
      Wallet.schema,
    );
    const account = await AccountRepository.build(
      database,
      Account.name,
      Account.schema,
    );
    const transaction = await TransactionRepository.build(
      database,
      Transaction.name,
      Transaction.schema,
    );
    const priceHistory = await Repository.create<IPriceHistory>(
      database,
      PriceHistory.name,
      PriceHistory.schema,
    );
    const priceInfo = await Repository.create<IPriceInfo>(
      database,
      PriceInfo.name,
      PriceInfo.schema,
    );
    const transactionNotificationClick =
      await Repository.create<ITransactionNotificationClick>(
        database,
        TransactionNotificationClick.name,
        TransactionNotificationClick.schema,
      );
    const transactionNotificationRead =
      await Repository.create<ITransactionNotificationRead>(
        database,
        TransactionNotificationRead.name,
        TransactionNotificationRead.schema,
      );
    const migration = await Repository.create<IMigration>(
      database,
      Migration.name,
      Migration.schema,
    );

    return new Database({
      database,
      device,
      wallet,
      account,
      transaction,
      priceHistory,
      priceInfo,
      transactionNotificationClick,
      transactionNotificationRead,
      migration,
    });
  }

  public async load(key?: string) {
    return this.database.load(key);
  }

  public async unload() {
    return this.database.unload();
  }

  public async isLoaded() {
    return this.database.isLoaded();
  }

  public async changeEncryptionKey(encryptionKey?: string) {
    await this.database.changeEncryptionKey(encryptionKey);
  }

  // eslint-disable-next-line class-methods-use-this
  public createOrFetchRepository<T extends IEntity>(
    name: string,
  ): Promise<IRepository<T> | null> {
    throw new Error(`Method not implemented. ${name}`);
  }

  public async close() {
    await this.database.close();
  }

  public async clear() {
    await this.database.clear();
  }

  private static async createDb(dirPath: string) {
    let dbPath = path.join(dirPath, 'data.db');

    if (dirPath === ':memory:') {
      dbPath = dirPath;
    } else if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const database = await EncryptedDB.create(dbPath);

    return database;
  }
}
