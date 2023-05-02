import type {
  IAccountRepository,
  IDeviceRepository,
  IPriceHistoryRepository,
  IPriceInfoRepository,
  ITransactionRepository,
  IWalletRepository,
  IEntity,
  IRepository,
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
  ): Promise<IRepository<T>>;
}

export * from './entities';
