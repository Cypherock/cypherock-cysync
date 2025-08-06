import { StellarApp } from '@cypherock/sdk-app-stellar';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  StellarApp.create(connection);

export const getAppletId = () => StellarApp.APPLET_ID;
