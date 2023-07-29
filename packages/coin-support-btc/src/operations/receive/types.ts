import {
  IReceiveEvent,
  IReceiveParams,
  ReceiveDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { GetPublicKeyStatus } from '@cypherock/sdk-app-btc';

export type IBtcReceiveParams = IReceiveParams;

export type IBtcReceiveEvent = IReceiveEvent;

export const statusMap: Partial<
  Record<GetPublicKeyStatus, ReceiveDeviceEvent | undefined>
> = {
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_INIT]: ReceiveDeviceEvent.INIT,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_CONFIRM]:
    ReceiveDeviceEvent.CONFIRMED,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_PASSPHRASE]:
    ReceiveDeviceEvent.PASSPHRASE_ENTERED,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_CARD]:
    ReceiveDeviceEvent.CARD_TAPPED,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_VERIFY]:
    ReceiveDeviceEvent.VERIFIED,
};
