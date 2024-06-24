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
  staticData: {
    averageEnergyPrice: string;
    totalBandwidthAvailable: number;
    totalEnergyAvailable: number;
  };
  computedData: {
    output: IPreparedTransactionOutput;
    fee: string;
    bandwidth: number;
    unsignedTransaction?: IUnsignedTransaction;
  };
}
