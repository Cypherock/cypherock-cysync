import {
  ReceiveDeviceEvent,
  SignMessageDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { SignMsgEvent } from '@cypherock/sdk-app-evm';

export const statusMap: Partial<
  Record<SignMessageDeviceEvent, ReceiveDeviceEvent | undefined>
> = {
  [SignMsgEvent.INIT]: ReceiveDeviceEvent.INIT,
  [SignMsgEvent.CONFIRM]: ReceiveDeviceEvent.CONFIRMED,
  [SignMsgEvent.PASSPHRASE]: ReceiveDeviceEvent.PASSPHRASE_ENTERED,
  [SignMsgEvent.PIN_CARD]: ReceiveDeviceEvent.CARD_TAPPED,
  [SignMsgEvent.VERIFY]: ReceiveDeviceEvent.VERIFIED,
};
