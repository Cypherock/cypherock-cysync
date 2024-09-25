import { AuthWalletType } from '@cypherock/sdk-app-inheritance';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IInheritanceWalletAuthParams {
  connection: IDeviceConnection;
  walletId: string;
  challenge: string;
  isPublicKey: boolean;
  type: AuthWalletType;
}

export type IInheritanceWalletAuthEventType = 'Result' | 'Device';

export enum InheritanceWalletAuthDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  SEED_BASED_CARD_TAPPED = 2,
  CARD_PAIRING_CARD_TAPPED = 3,
  WALLET_BASED_CARD_TAPPED = 4,
}

export interface IInheritanceWalletAuthEvent {
  type: IInheritanceWalletAuthEventType;
  walletBased?: {
    signature: string;
    publicKey?: string;
  };
  seedBased?: {
    signature: string;
    publicKey?: string;
  };
  device?: {
    isDone: boolean;
    events: Record<InheritanceWalletAuthDeviceEvent, boolean | undefined>;
  };
}
