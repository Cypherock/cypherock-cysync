import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';
import { ISignTxnResult } from '@cypherock/sdk-app-icp';

import { IPreparedIcpTransaction } from '../transaction';

export interface IBroadcastIcpTransactionParams
  extends IBroadcastTransactionParams<ISignTxnResult> {
  transaction: IPreparedIcpTransaction;
}
