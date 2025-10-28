import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { IDatabase, ITransaction } from '@cypherock/db-interfaces';

export enum ICantonTransactionChoice {
  ACCEPT = 'Accept',
  REJECT = 'Reject',
  WITHDRAW = 'Withdraw',
}

export interface IPrepareCantonChoiceTransactionParams {
  accountId: string;
  db: IDatabase;
  txn: ITransaction;
  choice: ICantonTransactionChoice;
}

export interface IPreparedCantonChoiceTransaction extends IPreparedTransaction {
  computedData: {
    preparedTransaction?: any;
  };
}
