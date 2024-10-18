import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedXrpTransaction } from '../transaction';

export interface IPrepareXrpTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedXrpTransaction;
}
