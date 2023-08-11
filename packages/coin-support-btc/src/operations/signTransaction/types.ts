import {
  ISignTransactionParams,
  ISignTransactionEvent,
  SignTransactionDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { SignTxnStatus } from '@cypherock/sdk-app-btc';

export type ISignBtcTransactionParams = ISignTransactionParams;

export type ISignBtcTransactionEvent = ISignTransactionEvent;

export const signBtcToDeviceEventMap: Partial<
  Record<SignTxnStatus, SignTransactionDeviceEvent | undefined>
> = {
  [SignTxnStatus.SIGN_TXN_STATUS_INIT]: SignTransactionDeviceEvent.INIT,
  [SignTxnStatus.SIGN_TXN_STATUS_CONFIRM]: SignTransactionDeviceEvent.CONFIRMED,
  [SignTxnStatus.SIGN_TXN_STATUS_PASSPHRASE]:
    SignTransactionDeviceEvent.PASSPHRASE_ENTERED,
  [SignTxnStatus.SIGN_TXN_STATUS_CARD]: SignTransactionDeviceEvent.CARD_TAPPED,
};
