import { IDatabase, IAccount } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export enum SignMessageDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  PASSPHRASE_ENTERED = 2,
  CARD_TAPPED = 3,
}

export interface ISignMessageParams {
  db: IDatabase;
  connection: IDeviceConnection;
  walletId: string;
  coinId: string;
  waitInMSBetweenEachAccountAPI?: number;
}

export type ISignMessageEventType = 'Message' | 'Device';

export interface ISignMessageEvent {
  type: ISignMessageEventType;
  account?: IAccount;
  device?: {
    isDone: boolean;
    events: Record<SignMessageDeviceEvent, boolean | undefined>;
  };
}
