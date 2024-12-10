import {
  IReceiveEvent,
  IReceiveParams,
  ReceiveDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { GetPublicKeysEvent } from '@cypherock/sdk-app-starknet';

export type IStarknetReceiveParams = IReceiveParams;

export type IStarknetReceiveEvent = IReceiveEvent;

export const statusMap: Partial<
  Record<GetPublicKeysEvent, ReceiveDeviceEvent | undefined>
> = {
  [GetPublicKeysEvent.INIT]: ReceiveDeviceEvent.INIT,
  [GetPublicKeysEvent.CONFIRM]: ReceiveDeviceEvent.CONFIRMED,
  [GetPublicKeysEvent.PASSPHRASE]: ReceiveDeviceEvent.PASSPHRASE_ENTERED,
  [GetPublicKeysEvent.PIN_CARD]: ReceiveDeviceEvent.CARD_TAPPED,
  [GetPublicKeysEvent.VERIFY]: ReceiveDeviceEvent.VERIFIED,
};
