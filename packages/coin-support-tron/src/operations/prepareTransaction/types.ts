import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedTronTransaction } from '../transaction';

export interface IPrepareTronTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedTronTransaction;
}
