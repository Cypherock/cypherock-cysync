import {
  IAccountRepository,
  IDatabase,
  IDevice,
  IDeviceRepository,
  IEntity,
  IPriceHistoryRepository,
  IPriceInfoRepository,
  IRepository,
  ITransactionRepository,
  IWallet,
  IWalletRepository,
} from '@cypherock/db-interfaces';
import { Database as DB } from 'better-sqlite3';
import { ITableSchema, Repository } from './repository/Repository';

export class Database implements IDatabase {
  private readonly database: DB;

  device: IDeviceRepository;

  account: IAccountRepository;

  transaction: ITransactionRepository;

  wallet: IWalletRepository;

  priceHistory: IPriceHistoryRepository;

  priceInfo: IPriceInfoRepository;

  constructor(db: DB) {
    this.database = db;

    const deviceSchema: ITableSchema = {
      serial: { type: 'string' },
      isAuthenticated: { type: 'boolean' },
      version: { type: 'string' },
    };
    this.device = new Repository<IDevice>(
      this.database,
      'device',
      deviceSchema,
    );
    const walletSchema: ITableSchema = {
      name: { type: 'string' },
      hasPin: { type: 'boolean' },
      hasPassphrase: { type: 'boolean' },
      deviceId: { type: 'string' },
    };
    this.wallet = new Repository<IWallet>(
      this.database,
      'wallet',
      walletSchema,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  createOrFetchRepository<T extends IEntity>(
    name: string,
  ): Promise<IRepository<T> | null> {
    throw new Error(`Method not implemented. ${name}`);
  }
}

export const initializeDb = async (database: DB) => new Database(database);
