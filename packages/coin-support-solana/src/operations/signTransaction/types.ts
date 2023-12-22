import {
  ISignTransactionParams,
  ISignTransactionEvent,
  SignTransactionDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { SignTxnEvent } from '@cypherock/sdk-app-solana';

export type ISignSolanaTransactionParams = ISignTransactionParams;

export type ISignSolanaTransactionEvent = ISignTransactionEvent;

export const signSolanaToDeviceEventMap: Partial<
  Record<SignTxnEvent, SignTransactionDeviceEvent | undefined>
> = {
  [SignTxnEvent.INIT]: SignTransactionDeviceEvent.INIT,
  [SignTxnEvent.CONFIRM]: SignTransactionDeviceEvent.CONFIRMED,
  [SignTxnEvent.VERIFY]: SignTransactionDeviceEvent.VERIFIED,
  [SignTxnEvent.PASSPHRASE]: SignTransactionDeviceEvent.PASSPHRASE_ENTERED,
  [SignTxnEvent.PIN_CARD]: SignTransactionDeviceEvent.CARD_TAPPED,
};
