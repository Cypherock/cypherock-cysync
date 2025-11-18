import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';

export interface IPrepareCantonTransferPreApprovalTransactionParams {
  accountId: string;
  db: IDatabase;
  keyDB: IKeyValueStore;
}

export interface IPreparedCantonTransferPreApprovalTransaction
  extends IPreparedTransaction {
  computedData: {
    preparedTransaction?: any;
  };
}
