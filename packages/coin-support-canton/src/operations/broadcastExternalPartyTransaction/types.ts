import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedCantonExternalPartyTransaction } from '../transaction';

export interface IBroadcastCantonExternalPartyTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedCantonExternalPartyTransaction;
}
