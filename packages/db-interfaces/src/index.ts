import { IAccountRepository } from './entities/Account';
import { IDeviceRepository } from './entities/Device';
import { IPriceHistoryRepository } from './entities/PriceHistory';
import { IPriceInfoRepository } from './entities/PriceInfo';
import { ITransactionRepository } from './entities/Transaction';
import { IWalletRepository } from './entities/Wallet';
import { IUIFunctions } from './uiFunctions';

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
