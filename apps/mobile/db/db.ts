import Realm from 'realm';
import {
  IDatabase,
  IDeviceRepository,
  IAccountRepository,
  ITransactionRepository,
  IWalletRepository,
  IEntity,
  IWallet,
  IRepository,
  ObjectLiteral,
  IInheritancePlanRepository,
  IMigrationRepository,
  IPriceHistoryRepository,
  IPriceInfoRepository,
  ITransactionNotificationClickRepository,
  ITransactionNotificationReadRepository,
  ITransactionNotificationRead,
  ITransactionNotificationClick,
  IPriceHistory,
  IPriceInfo,
} from '@cypherock/db-interfaces';
import { Repository } from './repository/Repository';
import { AccountRepository } from './repository/AccountRepository';
import { TransactionRepository } from './repository/TransactionRepository';
import { Wallet } from './models/Wallet';
import { Account } from './models/Account';
import { Transaction } from './models/Transaction';
import { TransactionNotificationRead } from './models/TransactionNotificationRead';
import { TransactionNotificationClick } from './models/TransactionNotificationClick';
import { PriceHistory } from './models/PriceHistory';
import { PriceInfo } from './models/PriceInfo';

export class Database implements IDatabase {
  private database: Realm | undefined;

  account: IAccountRepository;
  wallet: IWalletRepository;
  device!: IDeviceRepository;
  transaction: ITransactionRepository;
  transactionNotificationRead: ITransactionNotificationReadRepository;
  transactionNotificationClick: ITransactionNotificationClickRepository;
  priceHistory: IPriceHistoryRepository;
  priceInfo: IPriceInfoRepository;
  migration!: IMigrationRepository;
  inheritancePlan!: IInheritancePlanRepository;

  constructor(params: {
    database: Realm;
    account: IAccountRepository;
    wallet: IWalletRepository;
    transaction: ITransactionRepository;
    transactionNotificationRead: ITransactionNotificationReadRepository;
    transactionNotificationClick: ITransactionNotificationClickRepository;
    priceHistory: IPriceHistoryRepository;
    priceInfo: IPriceInfoRepository;
  }) {
    this.database = params.database;

    this.account = params.account;
    this.wallet = params.wallet;
    this.transaction = params.transaction;
    this.transactionNotificationRead = params.transactionNotificationRead;
    this.transactionNotificationClick = params.transactionNotificationClick;
    this.priceHistory = params.priceHistory;
    this.priceInfo = params.priceInfo;
  }

  public static async create() {
    const database = await Realm.open({
      path: 'parallellines',
      schema: [
        Wallet.schema,
        Account.schema,
        Transaction.schema,
        TransactionNotificationRead.schema,
        TransactionNotificationClick.schema,
        PriceHistory.schema,
        PriceInfo.schema,
      ],
    });

    const [
      wallet,
      account,
      transaction,
      transactionNotificationRead,
      transactionNotificationClick,
      priceHistory,
      priceInfo,
    ] = await Promise.all([
      Repository.create<IWallet>(database, Wallet.name, Wallet.schema),
      AccountRepository.build(database, Account.name),
      TransactionRepository.build(database, Transaction.name),
      Repository.create<ITransactionNotificationRead>(
        database,
        TransactionNotificationRead.name,
        TransactionNotificationRead.schema,
      ),
      Repository.create<ITransactionNotificationClick>(
        database,
        TransactionNotificationClick.name,
        TransactionNotificationClick.schema,
      ),
      Repository.create<IPriceHistory>(
        database,
        PriceHistory.name,
        PriceHistory.schema,
      ),
      Repository.create<IPriceInfo>(database, PriceInfo.name, PriceInfo.schema),
    ]);

    return new Database({
      database,
      wallet,
      account,
      transaction,
      transactionNotificationClick,
      transactionNotificationRead,
      priceHistory,
      priceInfo,
    });
  }

  /** TODO: implementation incomplete */
  async load(key?: string): Promise<void> {
    return;
  }

  async unload(): Promise<void> {
    if (this.database) {
      this.database.close();
      this.database = undefined;
    }
  }

  async isLoaded(): Promise<boolean> {
    return !!this.database;
  }

  async changeEncryptionKey(encryptionKey?: string): Promise<void> {
    if (!this.database) throw new Error('Database not loaded');
    await this.load(encryptionKey);
  }

  async createOrFetchRepository<T extends IEntity>(
    name: string,
    schema: ObjectLiteral,
  ): Promise<IRepository<T> | null> {
    if (!this.database) throw new Error('Database not loaded');
    return null;
  }

  async close(): Promise<void> {
    await this.unload();
  }

  async clear(): Promise<void> {
    if (!this.database) throw new Error('Database not loaded');
    this.database.write(() => {
      this.database?.deleteAll();
    });
  }

  public getRealm(): Realm | undefined {
    return this.database;
  }
}

export function createDB() {
  return Database.create();
}
