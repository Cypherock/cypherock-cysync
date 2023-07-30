import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IReceiveParams {
  db: IDatabase;
  connection?: IDeviceConnection;
  accountId: string;
}

export type IReceiveEventType = 'Address' | 'Device' | 'AddressMatched';

export enum ReceiveDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  PASSPHRASE_ENTERED = 2,
  CARD_TAPPED = 3,
  VERIFIED = 4,
}

export interface IReceiveEvent {
  type: IReceiveEventType;
  didAddressMatched?: boolean;
  address?: string;
  device?: {
    isDone: boolean;
    events: Record<ReceiveDeviceEvent, boolean | undefined>;
  };
}
