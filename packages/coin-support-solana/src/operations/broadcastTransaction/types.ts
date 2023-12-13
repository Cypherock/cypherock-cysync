import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedSolanaTransaction } from '../transaction';

export interface IBroadcastSolanaTransactionParams
  extends IBroadcastTransactionParams {
  transaction: IPreparedSolanaTransaction;
}
