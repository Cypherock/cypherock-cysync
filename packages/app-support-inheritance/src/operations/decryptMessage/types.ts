import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IInheritanceDecryptMessageParams {
  connection: IDeviceConnection;
  walletId: string;
  message: string;
}

export type IInheritanceDecryptMessageEventType = 'Result' | 'Device';

export enum InheritanceDecryptMessageDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  CARD_TAPPED = 2,
  PIN_VERIFIED = 3,
}

export interface IInheritanceDecryptMessageEvent {
  type: IInheritanceDecryptMessageEventType;
  decryptedMessages?: Record<number, string | undefined>;
  device?: {
    isDone: boolean;
    events: Record<InheritanceDecryptMessageDeviceEvent, boolean | undefined>;
  };
}
