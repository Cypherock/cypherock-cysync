import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedTronTransaction } from '../transaction';

export interface IBroadcastTronTransactionParams
  extends IBroadcastTransactionParams {
  transaction: IPreparedTronTransaction;
}
