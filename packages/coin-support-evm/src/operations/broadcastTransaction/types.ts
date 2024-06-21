import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedEvmTransaction } from '../transaction';

export interface IBroadcastEvmTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedEvmTransaction;
}
