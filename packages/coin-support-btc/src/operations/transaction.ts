import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

import { IUtxo } from '../services';

export interface IPreparedBtcTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedTransactionOutput[];
    feeRate: number;
  };
  staticData: {
    averageFee: number;
    utxos: IUtxo[];
  };
  computedData: {
    inputs: any[];
    outputs: any[];
    fee: number;
  };
}
