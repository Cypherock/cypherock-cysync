import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedBtcTransaction } from '../transaction';

export interface IPrepareBtcTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedBtcTransaction;
}
