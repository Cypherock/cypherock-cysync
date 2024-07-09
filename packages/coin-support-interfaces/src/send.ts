import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IPreparedTransactionOutput {
  address: string;
  amount: string;
  remarks?: string;
}

export interface IPreparedTransaction {
  accountId: string;
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
    isValidFee: boolean;
    ownOutputAddressNotAllowed: boolean[];
    zeroAmountNotAllowed: boolean;
  };
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    isSendAll: boolean;
  };
  staticData: object;
  computedData: object;
}

export interface IInitializeTransactionParams {
  db: IDatabase;
  accountId: string;
}

export interface IPrepareTransactionParams {
  accountId: string;
  db: IDatabase;
  txn: IPreparedTransaction;
}

export enum SignTransactionDeviceEvent {
  INIT = 0,
  CONFIRMED = 1,
  VERIFIED = 2,
  PASSPHRASE_ENTERED = 3,
  CARD_TAPPED = 4,
}

export interface ISignTransactionParams {
  db: IDatabase;
  connection: IDeviceConnection;
  transaction: IPreparedTransaction;
}

export type ISignTransactionEventType = 'Transaction' | 'Device';

export interface ISignTransactionEvent<T> {
  type: ISignTransactionEventType;
  transaction?: T;
  device?: {
    isDone: boolean;
    events: Record<SignTransactionDeviceEvent, boolean | undefined>;
  };
}

export interface IBroadcastTransactionParams<T> {
  db: IDatabase;
  transaction: IPreparedTransaction;
  signedTransaction: T;
}
