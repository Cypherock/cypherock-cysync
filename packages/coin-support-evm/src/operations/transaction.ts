import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

export interface IPreparedEvmTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    gasPrice?: string;
    gasLimit?: string;
    isSendAll: boolean;
  };
  staticData: {
    averageGasPrice: string;
  };
  computedData: {
    output: IPreparedTransactionOutput;
    fee: string;
    gasPrice: string;
    gasLimit: string;
  };
}
