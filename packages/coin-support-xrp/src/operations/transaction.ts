import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

export interface IPreparedXrpTransactionOutput
  extends IPreparedTransactionOutput {
  destinationTag?: number;
}

export interface IPreparedXrpTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedXrpTransactionOutput[];
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
    isAmountBelowXrpReserveAllowed: boolean;
    isBalanceBelowXrpReserve: boolean;
  };
  staticData: {
    fees: string;
  };
  computedData: {
    output: IPreparedXrpTransactionOutput & {
      isActivated?: boolean;
    };
    fees: string;
  };
}
