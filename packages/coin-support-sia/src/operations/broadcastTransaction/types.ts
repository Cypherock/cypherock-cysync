import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedSiaTransaction } from '../transaction';

export interface IBroadcastSiaTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedSiaTransaction;
}
