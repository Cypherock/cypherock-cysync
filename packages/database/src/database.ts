import {
  IAccountRepository,
  IDatabase,
  IDevice,
  IDeviceRepository,
  IEntity,
  IKeyValueStore,
  IPriceHistory,
  IPriceHistoryRepository,
  IPriceInfo,
  IPriceInfoRepository,
  IRepository,
  ITransactionRepository,
  IWallet,
  IWalletRepository,
} from '@cypherock/db-interfaces';
import { Database as DB } from 'better-sqlite3';
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

export class Database implements IDatabase {
  private readonly database: DB;

  device: IDeviceRepository;

  account: IAccountRepository;

  transaction: ITransactionRepository;

  wallet: IWalletRepository;

  priceHistory: IPriceHistoryRepository;

  priceInfo: IPriceInfoRepository;

  storage: IKeyValueStore;

  constructor(db: DB, kvsDb: DB) {
    this.database = db;
    this.storage = new KeyValueStore(kvsDb);

    this.device = new Repository<IDevice>(
      this.database,
      Device.name,
      Device.schema,
    );
    this.wallet = new Repository<IWallet>(
      this.database,
      Wallet.name,
      Wallet.schema,
    );
    this.account = new AccountRepository(
      this.database,
      Account.name,
      Account.schema,
    );
    this.transaction = new TransactionRepository(
      this.database,
      Transaction.name,
      Transaction.schema,
    );
    this.priceHistory = new Repository<IPriceHistory>(
      this.database,
      PriceHistory.name,
      PriceHistory.schema,
    );
    this.priceInfo = new Repository<IPriceInfo>(
      this.database,
      PriceInfo.name,
      PriceInfo.schema,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  createOrFetchRepository<T extends IEntity>(
    name: string,
  ): Promise<IRepository<T> | null> {
    throw new Error(`Method not implemented. ${name}`);
  }

  destroy(): void {
    this.database.close();
  }
}
