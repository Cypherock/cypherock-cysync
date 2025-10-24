import { SiaApp } from '@cypherock/sdk-app-sia';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  SiaApp.create(connection);

export const getAppletId = () => SiaApp.APPLET_ID;
