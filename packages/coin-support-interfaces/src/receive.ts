import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IReceiveParams {
  db: IDatabase;
  connection: IDeviceConnection;
  accountId: string;
  walletId: string;
  waitInMSBetweenEachAccountAPI?: number;
}

export type IReceiveEventType = 'Address' | 'Device' | 'AddressMatched';

export interface IReceiveEvent {
  type: IReceiveEventType;
  addressMatched?: boolean;
  address?: string;
  device?: {
    isDone: boolean;
    events: Record<number, boolean | undefined>;
  };
}
