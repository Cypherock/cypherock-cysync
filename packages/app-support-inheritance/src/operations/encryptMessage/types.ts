import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IInheritanceEncryptMessageParams {
  connection: IDeviceConnection;
  walletId: string;
  cardLocation?: string;
  personalMessage?: string;
}

export type IInheritanceEncryptMessageEventType = 'Result' | 'Device';

export enum InheritanceEncryptMessageDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  VERIFIED = 2,
  PIN_CARD_TAPPED = 3,
  MESSAGE_CARD_TAPPED = 4,
}

export interface IInheritanceEncryptMessageEvent {
  type: IInheritanceEncryptMessageEventType;
  encryptedMessages?: string;
  device?: {
    isDone: boolean;
    events: Record<InheritanceEncryptMessageDeviceEvent, boolean | undefined>;
  };
}
