import { NearApp } from '@cypherock/sdk-app-near';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  NearApp.create(connection);
