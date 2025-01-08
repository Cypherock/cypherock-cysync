import { StarknetApp } from '@cypherock/sdk-app-starknet';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  StarknetApp.create(connection);
