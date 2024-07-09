import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';
import { IUnsignedTransaction } from '@cypherock/sdk-app-tron';

export interface IPreparedTronTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    isSendAll: boolean;
  };
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
    notEnoughEnergy: boolean;
    isValidFee: boolean;
    ownOutputAddressNotAllowed: boolean[];
    zeroAmountNotAllowed: boolean;
  };
  staticData: {
    averageEnergyPrice: string;
    totalBandwidthAvailable: number;
    totalEnergyAvailable: number;
  };
  computedData: {
    output: {
      address: string;
      amount: string;
      isActivated?: boolean;
    };
    fee: string;
    bandwidth: number;
    estimatedEnergy: number;
    unsignedTransaction?: IUnsignedTransaction;
  };
}
