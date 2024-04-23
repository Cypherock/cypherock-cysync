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
  ITransactionNotificationClickRepository,
  ITransactionNotificationReadRepository,
  IMigrationRepository,
} from './entities';

export interface IDatabase {
  load(key?: string): Promise<void>;
  unload(): Promise<void>;
  isLoaded(): Promise<boolean>;
  device: IDeviceRepository;
  account: IAccountRepository;
  transaction: ITransactionRepository;
  transactionNotificationRead: ITransactionNotificationReadRepository;
  transactionNotificationClick: ITransactionNotificationClickRepository;
  wallet: IWalletRepository;
  priceHistory: IPriceHistoryRepository;
  priceInfo: IPriceInfoRepository;
  migration: IMigrationRepository;
  changeEncryptionKey(encryptionKey?: string): Promise<void>;
  createOrFetchRepository<T extends IEntity>(
    name: string,
    schema: ObjectLiteral,
  ): Promise<IRepository<T> | null>;
  close(): Promise<void>;
  clear(): Promise<void>;
}

export * from './entities';
export * from './errors';
export * from './keyValueStore';
