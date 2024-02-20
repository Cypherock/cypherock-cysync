import { IPrepareTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedStarknetTransaction } from '../transaction';

export interface IPrepareStarknetTransactionParams
  extends IPrepareTransactionParams {
  txn: IPreparedStarknetTransaction;
}
