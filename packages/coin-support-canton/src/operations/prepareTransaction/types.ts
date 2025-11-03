import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedCantonTransaction } from '../transaction';

export interface IPrepareCantonTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedCantonTransaction;
  accessToken: string;
}
