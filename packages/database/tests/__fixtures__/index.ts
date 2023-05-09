import { IEntity } from '@cypherock/db-interfaces';
import { deviceData } from './device';
import { ITestClass } from './types';
import { walletData } from './wallet';

const fixtures: ITestClass<IEntity>[] = [deviceData, walletData];

export default fixtures;
