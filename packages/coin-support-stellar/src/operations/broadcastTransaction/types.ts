import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedStellarTransaction } from '../transaction';

export interface IBroadcastStellarTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedStellarTransaction;
}
