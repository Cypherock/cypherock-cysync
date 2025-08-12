import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

export enum IStellarMemoType {
  NONE = 'none',
  TEXT = 'text',
  ID = 'id',
  HASH = 'hash',
  RETURN = 'return',
}

export interface IStellarMemo {
  type: IStellarMemoType;
  value?: string;
}

export interface IPreparedStellarTransactionOutput
  extends IPreparedTransactionOutput {
  memo?: IStellarMemo;
}

export interface IPreparedStellarTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedStellarTransactionOutput[];
    isSendAll: boolean;
    fees: string;
  };
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
    isValidFee: boolean;
    isFeeBelowMin: boolean;
    ownOutputAddressNotAllowed: boolean[];
    zeroAmountNotAllowed: boolean;
    isAmountBelowStellarReserve: boolean;
    isBalanceBelowStellarReserve: boolean;
    isInvalidMemo: boolean;
  };
  staticData: {
    fees: { baseFee: string; recommendedFee: string };
    reserveBaseBalance: string;
  };
  computedData: {
    output: IPreparedStellarTransactionOutput & {
      isActivated?: boolean;
    };
    fees: string;
  };
}
