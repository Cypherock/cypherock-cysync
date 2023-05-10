import { IEntity } from '@cypherock/db-interfaces';
import { deviceData } from './device';
import { ITestClass } from './types';
import { walletData } from './wallet';
import { accountData } from './account';

const fixtures: ITestClass<IEntity>[] = [deviceData, walletData, accountData];

export default fixtures;
