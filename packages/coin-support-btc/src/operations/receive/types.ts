import {
  IReceiveEvent,
  IReceiveParams,
  ReceiveFlowStatus,
} from '@cypherock/coin-support-interfaces';
import { GetPublicKeyStatus } from '@cypherock/sdk-app-btc';

export type IBtcReceiveParams = IReceiveParams;

export type IBtcReceiveEvent = IReceiveEvent;

export const statusMap: Record<
  GetPublicKeyStatus,
  ReceiveFlowStatus | undefined
> = {
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_INIT]: ReceiveFlowStatus.INIT,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_CONFIRM]: ReceiveFlowStatus.CONFIRM,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_PASSPHRASE]:
    ReceiveFlowStatus.PASSPHRASE,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_PIN]: ReceiveFlowStatus.PIN,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_CARD]: ReceiveFlowStatus.CARD,
  [GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_VERIFY]: ReceiveFlowStatus.VERIFY,
  [GetPublicKeyStatus.UNRECOGNIZED]: undefined,
};
