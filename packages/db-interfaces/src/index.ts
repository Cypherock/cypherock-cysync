import type { IAccountRepository } from './entities/account';
import { IEntity, IRepository } from './entities/base';
import type { IDeviceRepository } from './entities/device';
import type { IPriceHistoryRepository } from './entities/priceHistory';
import type { IPriceInfoRepository } from './entities/priceInfo';
import type { ITransactionRepository } from './entities/transaction';
import type { IWalletRepository } from './entities/wallet';

export interface IDatabase {
  device: IDeviceRepository;
  account: IAccountRepository;
  transaction: ITransactionRepository;
  wallet: IWalletRepository;
  priceHistory: IPriceHistoryRepository;
  priceInfo: IPriceInfoRepository;
  createOrFetchRepository<T extends IEntity>(
    name: string,
  ): Promise<IRepository<T> | null>;
}
