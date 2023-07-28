import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IReceiveParams {
  db: IDatabase;
  connection: IDeviceConnection;
  accountId: string;
}

export type IReceiveEventType = 'Address' | 'Device' | 'AddressMatched';

export enum ReceiveFlowStatus {
  INIT = 0,
  CONFIRM = 1,
  PASSPHRASE = 2,
  PIN = 3,
  CARD = 4,
  VERIFY = 5,
}
export interface IReceiveEvent {
  type: IReceiveEventType;
  didAddressMatched?: boolean;
  address?: string;
  device?: {
    isDone: boolean;
    events: Record<ReceiveFlowStatus, boolean | undefined>;
  };
}
