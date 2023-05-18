import type {
  IAccountRepository,
  IDeviceRepository,
  IPriceHistoryRepository,
  IPriceInfoRepository,
  ITransactionRepository,
  IWalletRepository,
  IEntity,
  IRepository,
  ObjectLiteral,
} from './entities';

export interface IDatabase {
  device: IDeviceRepository;
  account: IAccountRepository;
  transaction: ITransactionRepository;
  wallet: IWalletRepository;
  priceHistory: IPriceHistoryRepository;
  priceInfo: IPriceInfoRepository;
  createOrFetchRepository<T extends IEntity>(
    name: string,
    schema: ObjectLiteral,
  ): Promise<IRepository<T> | null>;
}

export * from './entities';
export * from './errors';
