import {
  IReceiveEvent,
  IReceiveParams,
} from '@cypherock/coin-support-interfaces';
import { GetPublicKeysEvent } from '@cypherock/sdk-app-icp';

export type IIcpReceiveParams = IReceiveParams;

export enum IcpReceiveDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  PASSPHRASE_ENTERED = 2,
  CARD_TAPPED = 3,
  ACCOUNT_ID_VERIFIED = 4,
  PRINCIPAL_ID_VERIFIED = 5,
}

export interface IIcpReceiveEvent extends IReceiveEvent {
  device?: {
    isDone: boolean;
    events: Record<IcpReceiveDeviceEvent, boolean | undefined>;
  };
}

export const statusMap: Partial<
  Record<GetPublicKeysEvent, IcpReceiveDeviceEvent | undefined>
> = {
  [GetPublicKeysEvent.INIT]: IcpReceiveDeviceEvent.INIT,
  [GetPublicKeysEvent.CONFIRM]: IcpReceiveDeviceEvent.CONFIRMED,
  [GetPublicKeysEvent.PASSPHRASE]: IcpReceiveDeviceEvent.PASSPHRASE_ENTERED,
  [GetPublicKeysEvent.PIN_CARD]: IcpReceiveDeviceEvent.CARD_TAPPED,
  [GetPublicKeysEvent.ACCOUNT_ID_VERIFY]:
    IcpReceiveDeviceEvent.ACCOUNT_ID_VERIFIED,
  [GetPublicKeysEvent.PRINCIPAL_ID_VERIFY]:
    IcpReceiveDeviceEvent.PRINCIPAL_ID_VERIFIED,
};
