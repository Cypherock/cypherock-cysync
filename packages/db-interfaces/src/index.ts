import type { IAccountRepository } from './entities/Account';
import type { IDeviceRepository } from './entities/Device';
import type { IPriceHistoryRepository } from './entities/PriceHistory';
import type { IPriceInfoRepository } from './entities/PriceInfo';
import type { ITransactionRepository } from './entities/Transaction';
import type { IWalletRepository } from './entities/Wallet';
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
