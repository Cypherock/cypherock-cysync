import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';
import { ICustomSolanaInstruction } from '../utils';

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
    isAmountBelowRentExempt: boolean;
  };
  staticData: {
    baseFee: string;
    rentExempt: string;
  };
  computedData: {
    output: IPreparedTransactionOutput & {
      doesExist?: boolean;
    };
    fees: string;
    instructions: ICustomSolanaInstruction[];
    computeUnits: number;
    computeUnitPriceMicroLamports: number;
  };
}
