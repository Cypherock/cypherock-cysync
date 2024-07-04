import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';
import { ISignedTransaction } from '@cypherock/sdk-app-tron';

import { IPreparedTronTransaction } from '../transaction';

export interface IBroadcastTronTransactionParams
  extends IBroadcastTransactionParams<ISignedTransaction> {
  transaction: IPreparedTronTransaction;
}
