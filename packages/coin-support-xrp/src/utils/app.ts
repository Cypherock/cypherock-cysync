import { XrpApp } from '@cypherock/sdk-app-xrp';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  XrpApp.create(connection);
