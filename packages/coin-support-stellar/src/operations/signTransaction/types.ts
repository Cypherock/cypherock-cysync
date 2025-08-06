import {
  ISignTransactionParams,
  ISignTransactionEvent,
  SignTransactionDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { SignTxnEvent } from '@cypherock/sdk-app-stellar';

export type ISignStellarTransactionParams = ISignTransactionParams;

export type ISignStellarTransactionEvent = ISignTransactionEvent<string>;

export const signStellarToDeviceEventMap: Partial<
  Record<SignTxnEvent, SignTransactionDeviceEvent | undefined>
> = {
  [SignTxnEvent.INIT]: SignTransactionDeviceEvent.INIT,
  [SignTxnEvent.CONFIRM]: SignTransactionDeviceEvent.CONFIRMED,
  [SignTxnEvent.VERIFY]: SignTransactionDeviceEvent.VERIFIED,
  [SignTxnEvent.PASSPHRASE]: SignTransactionDeviceEvent.PASSPHRASE_ENTERED,
  [SignTxnEvent.PIN_CARD]: SignTransactionDeviceEvent.CARD_TAPPED,
};
