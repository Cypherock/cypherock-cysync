import { SignMessageDeviceEvent } from '@cypherock/coin-support-interfaces';
import { SignMsgEvent } from '@cypherock/sdk-app-evm';

export const statusMap: Partial<
  Record<SignMsgEvent, SignMessageDeviceEvent | undefined>
> = {
  [SignMsgEvent.INIT]: SignMessageDeviceEvent.INIT,
  [SignMsgEvent.CONFIRM]: SignMessageDeviceEvent.CONFIRMED,
  [SignMsgEvent.PASSPHRASE]: SignMessageDeviceEvent.PASSPHRASE_ENTERED,
  [SignMsgEvent.PIN_CARD]: SignMessageDeviceEvent.CARD_TAPPED,
  [SignMsgEvent.VERIFY]: SignMessageDeviceEvent.VERIFIED,
};
