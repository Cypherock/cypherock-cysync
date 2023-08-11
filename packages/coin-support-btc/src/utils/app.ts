import { BtcApp } from '@cypherock/sdk-app-btc';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const createApp = (connection: IDeviceConnection) =>
  BtcApp.create(connection);
