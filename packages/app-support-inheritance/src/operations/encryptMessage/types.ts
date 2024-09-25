import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export const ENCRYPTED_DATA_SERIALIZATION_TAGS = {
  WALLET_MESSAGE: 2,
  NOMINEE_MESSAGE: 3,
};

export interface IInheritanceEncryptMessageParams {
  connection: IDeviceConnection;
  walletId: string;
  walletMessage?: string;
  nomineeMessage?: string;
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
