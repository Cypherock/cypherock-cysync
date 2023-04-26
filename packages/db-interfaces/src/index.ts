import type { IAccountRepository } from './entities/account';
import { IBaseEntity, IBaseRepository } from './entities/base';
import type { IDeviceRepository } from './entities/device';
import type { IPriceHistoryRepository } from './entities/priceHistory';
import type { IPriceInfoRepository } from './entities/priceInfo';
import type { ITransactionRepository } from './entities/transaction';
import type { IWalletRepository } from './entities/wallet';

interface IRepositories {
  device: IDeviceRepository;
  account: IAccountRepository;
  transaction: ITransactionRepository;
  wallet: IWalletRepository;
  priceHistory: IPriceHistoryRepository;
  priceInfo: IPriceInfoRepository;
  getRepositoryByName(
    name: string,
    entity: IBaseEntity,
  ): IBaseRepository<IBaseEntity> | null;
  createNewRepository(
    name: string,
    entity: IBaseEntity,
  ): IBaseRepository<IBaseEntity> | null;
}

export interface IDatabaseManager {
  repositories: IRepositories;
}
