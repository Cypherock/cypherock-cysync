import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

export interface IPreparedStarknetTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    isSendAll: boolean;
    txnType?: 'deploy' | 'transfer';
    maxFee?: string;
    nonce?: string;
  };
  staticData: {
    txnType: 'deploy' | 'transfer';
    maxFee: string;
  };
  computedData: {
    output: IPreparedTransactionOutput;
    data: string;
    maxFee: string;
  };
}
