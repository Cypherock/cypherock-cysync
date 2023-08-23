import {
  IReceiveEvent,
  IReceiveParams,
  ReceiveDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { GetPublicKeysStatus } from '@cypherock/sdk-app-evm';

export type IEvmReceiveParams = IReceiveParams;

export type IEvmReceiveEvent = IReceiveEvent;

export const statusMap: Partial<
  Record<GetPublicKeysStatus, ReceiveDeviceEvent | undefined>
> = {
  [GetPublicKeysStatus.GET_PUBLIC_KEYS_STATUS_INIT]: ReceiveDeviceEvent.INIT,
  [GetPublicKeysStatus.GET_PUBLIC_KEYS_STATUS_CONFIRM]:
    ReceiveDeviceEvent.CONFIRMED,
  [GetPublicKeysStatus.GET_PUBLIC_KEYS_STATUS_PASSPHRASE]:
    ReceiveDeviceEvent.PASSPHRASE_ENTERED,
  [GetPublicKeysStatus.GET_PUBLIC_KEYS_STATUS_CARD]:
    ReceiveDeviceEvent.CARD_TAPPED,
  [GetPublicKeysStatus.GET_PUBLIC_KEYS_STATUS_VERIFY]:
    ReceiveDeviceEvent.VERIFIED,
};
