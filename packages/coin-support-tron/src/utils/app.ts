import { TronApp } from '@cypherock/sdk-app-tron';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  TronApp.create(connection);

export const getAppletId = () => TronApp.APPLET_ID;
