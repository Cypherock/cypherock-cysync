import {
  IReceiveEvent,
  IReceiveParams,
} from '@cypherock/coin-support-interfaces';
import { GetPublicKeyStatus } from '@cypherock/sdk-app-btc';

export type IBtcReceiveParams = IReceiveParams;

export interface IBtcReceiveEvent extends IReceiveEvent {
  account?: string;
  device?: {
    isDone: boolean;
    events: Record<GetPublicKeyStatus, boolean | undefined>;
  };
}
