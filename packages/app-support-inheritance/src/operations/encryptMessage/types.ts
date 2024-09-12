import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IInheritanceEncryptMessageParams {
  connection: IDeviceConnection;
  walletId: string;
  messages: string[];
}

export type IInheritanceEncryptMessageEventType = 'Result' | 'Device';

export enum InheritanceEncryptMessageDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  VERIFIED = 2,
  CARD_TAPPED = 3,
}

export interface IInheritanceEncryptMessageEvent {
  type: IInheritanceEncryptMessageEventType;
  encryptedMessages?: string;
  device?: {
    isDone: boolean;
    events: Record<InheritanceEncryptMessageDeviceEvent, boolean | undefined>;
  };
}
