import {
  IReceiveEvent,
  IReceiveParams,
  ReceiveDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { GetPublicKeyEvent } from '@cypherock/sdk-app-btc';

export type IBtcReceiveParams = IReceiveParams;

export type IBtcReceiveEvent = IReceiveEvent;

export const statusMap: Partial<
  Record<GetPublicKeyEvent, ReceiveDeviceEvent | undefined>
> = {
  [GetPublicKeyEvent.INIT]: ReceiveDeviceEvent.INIT,
  [GetPublicKeyEvent.CONFIRM]: ReceiveDeviceEvent.CONFIRMED,
  [GetPublicKeyEvent.PASSPHRASE]: ReceiveDeviceEvent.PASSPHRASE_ENTERED,
  [GetPublicKeyEvent.PIN_CARD]: ReceiveDeviceEvent.CARD_TAPPED,
  [GetPublicKeyEvent.VERIFY]: ReceiveDeviceEvent.VERIFIED,
};
