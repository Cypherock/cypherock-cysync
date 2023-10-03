import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedEvmTransaction } from '../transaction';

export interface IPrepareEvmTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedEvmTransaction;
}
