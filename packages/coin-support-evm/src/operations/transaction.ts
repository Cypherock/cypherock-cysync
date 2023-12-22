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
    nonce?: string;
  };
  staticData: {
    averageGasPrice: string;
  };
  computedData: {
    output: IPreparedTransactionOutput;
    data: string;
    fee: string;
    gasPrice: string;
    gasLimit: string;
    gasLimitEstimate: string;
    l1Fee: string;
  };
}
