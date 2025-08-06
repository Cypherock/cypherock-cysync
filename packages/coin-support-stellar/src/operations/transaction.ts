import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

// Define the possible memo types
export enum StellarMemoType {
  NONE = 'none',
  TEXT = 'text',
  ID = 'id',
  HASH = 'hash',
  RETURN = 'return',
}

export interface IPreparedStellarTransactionOutput
  extends IPreparedTransactionOutput {
  memo?: {
    type: StellarMemoType;
    value?: string;
  };
  isCreateAccount?: boolean;
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
    fees: string;
    reserveBaseBalance: string;
  };
  computedData: {
    output: IPreparedStellarTransactionOutput & {
      isActivated?: boolean;
    };
    fees: string;
  };
}
