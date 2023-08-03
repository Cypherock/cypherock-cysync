import { IDatabase } from '@cypherock/db-interfaces';

export interface IPreparedTransactionOutput {
  address: string;
  amount: string;
}

export interface IPreparedTransaction {
  accountId: string;
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
  };
  userInputs: {
    outputs: IPreparedTransactionOutput[];
  };
  staticData: object;
  computedData: object;
}

export interface ICreateTransactionParams {
  db: IDatabase;
  accountId: string;
}

export interface IPrepareTransactionParams {
  accountId: string;
  db: IDatabase;
  txn: IPreparedTransaction;
}
