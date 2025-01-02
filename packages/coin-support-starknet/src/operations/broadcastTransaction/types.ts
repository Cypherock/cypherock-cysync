import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedStarknetTransaction } from '../transaction';

export interface IBroadcastStarknetTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedStarknetTransaction;
}
