import path from 'path';
import fs from 'fs';
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
} from '@cypherock/db-interfaces';
import JsonDB, { LokiFsAdapter } from 'lokijs';

import {
  AccountRepository,
  Repository,
  TransactionRepository,
} from './repository';
import {
  Account,
  Device,
  PriceHistory,
  PriceInfo,
  Transaction,
  Wallet,
} from './entity';
import { KeyValueStore } from './keyValueStore';
import { EncryptedDB } from './encryptedDb';

export class Database implements IDatabase {
  private readonly database: EncryptedDB;

  device: IDeviceRepository;

  account: IAccountRepository;

  transaction: ITransactionRepository;

  wallet: IWalletRepository;

  priceHistory: IPriceHistoryRepository;

  priceInfo: IPriceInfoRepository;

  storage: KeyValueStore;

  constructor(params: {
    database: EncryptedDB;
    device: IDeviceRepository;
    account: IAccountRepository;
    transaction: ITransactionRepository;
    wallet: IWalletRepository;
    priceHistory: IPriceHistoryRepository;
    priceInfo: IPriceInfoRepository;
    storage: KeyValueStore;
  }) {
    this.database = params.database;
    this.storage = params.storage;

    this.device = params.device;
    this.account = params.account;
    this.transaction = params.transaction;
    this.wallet = params.wallet;
    this.priceHistory = params.priceHistory;
    this.priceInfo = params.priceInfo;
  }

  public static async create(dirPath: string) {
    const { database, storageDb } = await Database.createDb(dirPath);

    const storage = new KeyValueStore(storageDb);

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

    return new Database({
      database,
      storage,
      device,
      wallet,
      account,
      transaction,
      priceHistory,
      priceInfo,
    });
  }

  private static async createDb(dirPath: string) {
    let dbPath = path.join(dirPath, 'db.sqlite');
    let storagePath = path.join(dirPath, 'storage.sqlite');

    if (dirPath === ':memory:') {
      dbPath = dirPath;
      storagePath = dirPath;
    } else if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const database = await EncryptedDB.create(dbPath);

    const storageDb = new JsonDB(
      storagePath,
      storagePath !== ':memory:'
        ? {
            adapter: new LokiFsAdapter(),
            autoload: true,
            autosave: true,
            autosaveInterval: 4000,
          }
        : undefined,
    );

    return { database, dbPath, storageDb };
  }

  // eslint-disable-next-line class-methods-use-this
  createOrFetchRepository<T extends IEntity>(
    name: string,
  ): Promise<IRepository<T> | null> {
    throw new Error(`Method not implemented. ${name}`);
  }

  async close() {
    await this.database.close();
    await this.storage.close();
  }
}
