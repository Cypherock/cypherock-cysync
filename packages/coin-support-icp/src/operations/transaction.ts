import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';
import type { Nonce } from '@dfinity/agent';

export interface IPreparedIcpTransactionOutput
  extends IPreparedTransactionOutput {
  memo?: string;
}

export interface IPreparedIcpTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedIcpTransactionOutput[];
    isSendAll: boolean;
  };
  staticData: {
    fees: string;
  };
  computedData: {
    output: IPreparedIcpTransactionOutput;
    fees: string;
    ingressExpiry: string;
    nonce: Nonce;
  };
}
