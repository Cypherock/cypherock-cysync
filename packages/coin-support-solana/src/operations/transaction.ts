import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';
import { ICustomSolanaInstruction } from '../services';

export interface IPreparedSolanaTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    isSendAll: boolean;
  };
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
    isValidFee: boolean;
    ownOutputAddressNotAllowed: boolean[];
    zeroAmountNotAllowed: boolean;
    isRentExemptFeeRequired: boolean;
  };
  staticData: {
    fees: string;
  };
  computedData: {
    output: IPreparedTransactionOutput;
    fees: string;
    instructions: ICustomSolanaInstruction[];
  };
}
