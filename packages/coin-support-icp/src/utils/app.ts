import { IcpApp } from '@cypherock/sdk-app-icp';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  IcpApp.create(connection);

export const getAppletId = () => IcpApp.APPLET_ID;
