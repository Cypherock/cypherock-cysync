import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedEvmTransaction } from '../transaction';

export interface IBroadcastEvmTransactionParams
  extends IBroadcastTransactionParams {
  transaction: IPreparedEvmTransaction;
}
