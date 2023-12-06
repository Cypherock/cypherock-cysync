import { SolanaApp } from '@cypherock/sdk-app-solana';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  SolanaApp.create(connection);
