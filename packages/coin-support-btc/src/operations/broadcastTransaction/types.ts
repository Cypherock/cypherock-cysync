import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedBtcTransaction } from '../transaction';

export interface IBroadcastBtcTransactionParams
  extends IBroadcastTransactionParams {
  transaction: IPreparedBtcTransaction;
}
