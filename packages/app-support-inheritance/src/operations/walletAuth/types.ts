import { WalletAuthEvent } from '@cypherock/sdk-app-inheritance';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IInheritanceWalletAuthParams {
  connection: IDeviceConnection;
  walletId: string;
  challenge: string;
  isPublicKey: boolean;
}

export type IInheritanceWalletAuthEventType = 'Result' | 'Device';

export enum InheritanceWalletAuthDeviceEvent {
  INIT = 0,
  CARD_TAP = 1,
}

export interface IInheritanceWalletAuthEvent {
  type: IInheritanceWalletAuthEventType;
  publicKey?: string;
  signature?: string;
  device?: {
    isDone: boolean;
    events: Record<WalletAuthEvent, boolean | undefined>;
  };
}
