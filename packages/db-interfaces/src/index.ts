import type { IAccountRepository } from './entities/account';
import type { IDeviceRepository } from './entities/device';
import type { IPriceHistoryRepository } from './entities/priceHistory';
import type { IPriceInfoRepository } from './entities/priceInfo';
import type { ITransactionRepository } from './entities/transaction';
import type { IWalletRepository } from './entities/wallet';
import type { IUIFunctions } from './uiFunctions';

interface IRepositories {
  device: IDeviceRepository;
  account: IAccountRepository;
  transaction: ITransactionRepository;
  wallet: IWalletRepository;
  priceHistory: IPriceHistoryRepository;
  priceInfo: IPriceInfoRepository;
}

export interface IDatabaseManager {
  repositories: IRepositories;
  uiFunctions: IUIFunctions;
}
