import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedIcpTransaction } from '../transaction';

export interface IPrepareIcpTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedIcpTransaction;
}
