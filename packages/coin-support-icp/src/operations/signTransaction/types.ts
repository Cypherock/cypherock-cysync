import {
  ISignTransactionParams,
  ISignTransactionEvent,
  SignTransactionDeviceEvent,
} from '@cypherock/coin-support-interfaces';
import { ISignTxnResult, SignTxnEvent } from '@cypherock/sdk-app-icp';

export type ISignIcpTransactionParams = ISignTransactionParams;

export type ISignIcpTransactionEvent = ISignTransactionEvent<ISignTxnResult>;

export const signIcpToDeviceEventMap: Partial<
  Record<SignTxnEvent, SignTransactionDeviceEvent | undefined>
> = {
  [SignTxnEvent.INIT]: SignTransactionDeviceEvent.INIT,
  [SignTxnEvent.CONFIRM]: SignTransactionDeviceEvent.CONFIRMED,
  [SignTxnEvent.VERIFY]: SignTransactionDeviceEvent.VERIFIED,
  [SignTxnEvent.PASSPHRASE]: SignTransactionDeviceEvent.PASSPHRASE_ENTERED,
  [SignTxnEvent.PIN_CARD]: SignTransactionDeviceEvent.CARD_TAPPED,
};
