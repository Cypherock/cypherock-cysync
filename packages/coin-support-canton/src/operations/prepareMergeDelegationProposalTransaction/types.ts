import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';

export interface IPrepareCantonMergeDelegationProposalTransactionParams {
  accountId: string;
  db: IDatabase;
  keyDB: IKeyValueStore;
}

export interface IPreparedCantonMergeDelegationProposalTransaction
  extends IPreparedTransaction {
  computedData: {
    preparedTransaction?: any;
  };
}
