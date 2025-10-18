import { CantonApp } from '@cypherock/sdk-app-canton';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  CantonApp.create(connection);

export const getAppletId = () => CantonApp.APPLET_ID;
