import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedCantonTransaction } from '../transaction';

export interface IBroadcastCantonTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedCantonTransaction;
  accessToken: string;
}
