import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

export interface IPreparedCantonTransactionOutput
  extends IPreparedTransactionOutput {
  memo?: string;
  expiry?: {
    unit: string;
    value: number;
  };
}

export interface IPreparedCantonTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedCantonTransactionOutput[];
    isSendAll: boolean;
  };
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
    isValidFee: boolean;
    isFeeBelowMin: boolean;
    ownOutputAddressNotAllowed: boolean[];
    zeroAmountNotAllowed: boolean;
    isInvalidExpiry: boolean;
  };
  staticData: {
    fees: string;
  };
  computedData: {
    output: IPreparedCantonTransactionOutput;
    fees: string;
  };
}
