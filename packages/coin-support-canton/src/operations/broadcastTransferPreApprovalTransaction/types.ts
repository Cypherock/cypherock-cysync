import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedCantonTransferPreApprovalTransaction } from '../types';

export interface IBroadcastCantonTransferPreApprovalTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedCantonTransferPreApprovalTransaction;
}
