import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export enum SignMessageDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  VERIFIED = 2,
  PASSPHRASE_ENTERED = 3,
  CARD_TAPPED = 4,
}

export interface ISignMessageParamsPayload {
  signingType: string;
  message: string;
}

export interface ISignMessageParams {
  db: IDatabase;
  account: IAccount;
  connection: IDeviceConnection;
  payload: ISignMessageParamsPayload;
}

export type ISignMessageEventType = 'Message' | 'Device';

export interface ISignMessageEvent {
  type: ISignMessageEventType;
  signature?: string;
  device?: {
    isDone: boolean;
    events: Record<SignMessageDeviceEvent, boolean | undefined>;
  };
}
