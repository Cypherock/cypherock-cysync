import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

import { FeeData } from '../services';

export interface IPreparedStarknetTransaction extends IPreparedTransaction {
  staticData: {
    fees: string;
    nonce: string;
  };
  computedData: {
    output: IPreparedTransactionOutput;
    feeData: FeeData;
  };
}
