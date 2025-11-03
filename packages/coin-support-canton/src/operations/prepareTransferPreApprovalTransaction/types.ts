import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { IDatabase } from '@cypherock/db-interfaces';

export interface IPrepareCantonTransferPreApprovalTransactionParams {
  accountId: string;
  db: IDatabase;
  accessToken: string;
}

export interface IPreparedCantonTransferPreApprovalTransaction
  extends IPreparedTransaction {
  computedData: {
    preparedTransaction?: any;
  };
}
