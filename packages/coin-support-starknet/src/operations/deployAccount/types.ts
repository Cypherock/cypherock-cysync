import {
  ISignTransactionParams,
  ISignTransactionEvent,
  SignTransactionDeviceEvent,
  IPreparedTransaction,
  IInitializeTransactionParams,
  IBroadcastTransactionParams,
} from '@cypherock/coin-support-interfaces';
import { SignTxnEvent } from '@cypherock/sdk-app-starknet';

import { FeeData } from '../../services';

export type IPrepareStarknetDeployAccountTransactionParams =
  IInitializeTransactionParams;

export interface IPreparedStarknetDeployAccountTransaction
  extends IPreparedTransaction {
  computedData: {
    feeData: FeeData;
    nonce: string;
    chainId: string;
  };
}

export type ISignStarknetDeployAccountTransactionParams =
  ISignTransactionParams;

export type ISignStarknetDeployAccountTransactionEvent =
  ISignTransactionEvent<string>;

export const signStarknetDeployAccountToDeviceEventMap: Partial<
  Record<SignTxnEvent, SignTransactionDeviceEvent | undefined>
> = {
  [SignTxnEvent.INIT]: SignTransactionDeviceEvent.INIT,
  [SignTxnEvent.CONFIRM]: SignTransactionDeviceEvent.CONFIRMED,
  [SignTxnEvent.VERIFY]: SignTransactionDeviceEvent.VERIFIED,
  [SignTxnEvent.PASSPHRASE]: SignTransactionDeviceEvent.PASSPHRASE_ENTERED,
  [SignTxnEvent.PIN_CARD]: SignTransactionDeviceEvent.CARD_TAPPED,
};

export interface IBroadcastStarknetDeployAccountTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedStarknetDeployAccountTransaction;
}
