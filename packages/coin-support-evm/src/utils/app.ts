import { EvmApp } from '@cypherock/sdk-app-evm';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  EvmApp.create(connection);
