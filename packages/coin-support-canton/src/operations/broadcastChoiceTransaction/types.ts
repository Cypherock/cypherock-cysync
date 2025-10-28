import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedCantonTransaction } from '../transaction';

export interface IBroadcastCantonChoiceTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedCantonTransaction;
}
