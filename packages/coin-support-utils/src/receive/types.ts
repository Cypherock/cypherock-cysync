import {
  IReceiveEvent,
  IReceiveParams,
} from '@cypherock/coin-support-interfaces';
import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Subscriber } from 'rxjs';

export interface App {
  destroy: () => Promise<void>;
}

export interface IGenerateReceiveAddressParams {
  db: IDatabase;
  accountId: string;
}

export interface IReceiveAddressInfo {
  address: string;
  expectedFromDevice: string;
  derivationPath: string;
}

export interface IGetReceiveAddressFromDevice<
  T extends App,
  K extends IReceiveEvent,
> {
  derivationPath: string;
  app: T;
  walletId: string;
  observer: Subscriber<K>;
}

export interface IReceiveObservableParams<
  T extends App,
  K extends IReceiveEvent,
> extends IReceiveParams {
  createApp: (connection: IDeviceConnection) => Promise<T>;
  generateReceiveAddress: (
    params: IGenerateReceiveAddressParams,
  ) => Promise<IReceiveAddressInfo>;
  getReceiveAddressFromDevice: (
    params: IGetReceiveAddressFromDevice<T, K>,
  ) => Promise<string>;
}
