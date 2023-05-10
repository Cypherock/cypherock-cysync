import { IEntity } from '@cypherock/db-interfaces';
import { deviceData } from './device';
import { ITestClass } from './types';
import { walletData } from './wallet';
import { accountData } from './account';
import { transactionData } from './transaction';
import { priceHistoryData } from './priceHistory';
import { priceInfoData } from './priceInfo';

const fixtures: ITestClass<IEntity>[] = [
  deviceData,
  walletData,
  accountData,
  transactionData,
  priceHistoryData,
  priceInfoData,
];

export default fixtures;
