import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

import { IUtxo } from '../services';

export interface IPreparedBtcTransactionInput {
  address: string;
  block_height: number;
  confirmations: number;
  txId: string;
  value: number;
  vout: number;
  derivationPath: string;
}

export interface IPreparedBtcTransactionOutput {
  address: string;
  value: number;
  // if it is a change address
  derivationPath?: string;
}

export interface IPreparedBtcTransaction extends IPreparedTransaction {
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
    isValidFee: boolean;
    isNotOverDustThreshold: boolean;
  };
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    feeRate: number;
    isSendAll: boolean;
  };
  staticData: {
    averageFee: number;
    utxos: IUtxo[];
  };
  computedData: {
    inputs: IPreparedBtcTransactionInput[];
    outputs: IPreparedBtcTransactionOutput[];
    fee: number;
  };
}
