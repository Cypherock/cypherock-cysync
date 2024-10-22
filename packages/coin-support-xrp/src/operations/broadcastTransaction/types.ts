import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedXrpTransaction } from '../transaction';

export interface IBroadcastXrpTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedXrpTransaction;
}
