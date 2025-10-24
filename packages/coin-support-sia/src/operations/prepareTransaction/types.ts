import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedSiaTransaction } from '../transaction';

export interface IPrepareSiaTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedSiaTransaction;
}
