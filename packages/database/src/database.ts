import {
  IAccountRepository,
  IDatabase,
  IDeviceRepository,
  IEntity,
  IPriceHistoryRepository,
  IPriceInfoRepository,
  IRepository,
  ITransactionRepository,
  IWalletRepository,
} from '@cypherock/db-interfaces';
import { DataSource, Table } from 'typeorm';
import { Device } from './entity/Device';
import { BaseRepository } from './repository/BaseRepository';
import { Account } from './entity/Account';
import { Transaction } from './entity/Transaction';
import { PriceHistory } from './entity/PriceHistory';
import { PriceInfo } from './entity/PriceInfo';
import { Wallet } from './entity/Wallet';
import { AccountRepository } from './repository/AccountRepository';
import { TransactionRepository } from './repository/TransactionRepository';

export class Database implements IDatabase {
  private readonly dataSource: DataSource;

  device: IDeviceRepository;

  account: IAccountRepository;

  transaction: ITransactionRepository;

  wallet: IWalletRepository;

  priceHistory: IPriceHistoryRepository;

  priceInfo: IPriceInfoRepository;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.device = new BaseRepository<Device>(
      this.dataSource.getRepository(Device),
    );
    this.account = new AccountRepository(
      this.dataSource.getRepository(Account),
    );
    this.transaction = new TransactionRepository(
      this.dataSource.getRepository(Transaction),
    );
    this.wallet = new BaseRepository<Wallet>(
      this.dataSource.getRepository(Wallet),
    );
    this.priceHistory = new BaseRepository<PriceHistory>(
      this.dataSource.getRepository(PriceHistory),
    );
    this.priceInfo = new BaseRepository<PriceInfo>(
      this.dataSource.getRepository(PriceInfo),
    );
  }

  async createOrFetchRepository<T extends IEntity>(
    name: string,
  ): Promise<IRepository<T> | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.createTable(
      new Table({
        name,
      }),
      true,
    );
    await queryRunner.release();
    const repo = await this.dataSource.getRepository<T>('name');
    return new BaseRepository<T>(repo);
  }
}

export const initializeDb = async (dataSource: DataSource) => {
  await dataSource.initialize();
  return new Database(dataSource);
};
