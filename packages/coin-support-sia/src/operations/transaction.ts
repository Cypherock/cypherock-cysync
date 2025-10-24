import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';
import { ISiaUtxo } from '../services';

export interface IPreparedSiaTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    isSendAll: boolean;
    fees: string;
  };
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
    isValidFee: boolean;
    ownOutputAddressNotAllowed: boolean[];
    zeroAmountNotAllowed: boolean;
  };
  staticData: {
    fees: { baseFee: string; recommendedFee: string };
  };
  computedData: {
    output: IPreparedTransactionOutput;
    fees: string;
    selectedUtxos: ISiaUtxo[];
  };
}
