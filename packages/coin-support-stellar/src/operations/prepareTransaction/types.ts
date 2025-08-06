import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedStellarTransaction } from '../transaction';

export interface IPrepareStellarTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedStellarTransaction;
}
