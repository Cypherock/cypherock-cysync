import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedSolanaTransaction } from '../transaction';

export interface IPrepareSolanaTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedSolanaTransaction;
}
