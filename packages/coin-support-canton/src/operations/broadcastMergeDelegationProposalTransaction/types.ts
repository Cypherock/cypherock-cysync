import { IBroadcastTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedCantonMergeDelegationProposalTransaction } from '../types';

export interface IBroadcastCantonMergeDelegationProposalTransactionParams
  extends IBroadcastTransactionParams<string> {
  transaction: IPreparedCantonMergeDelegationProposalTransaction;
}
