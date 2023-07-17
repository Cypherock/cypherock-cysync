import { ITransaction } from '@cypherock/db-interfaces';

export interface ITransactionState {
  isLoaded: boolean;
  transactions: ITransaction[];
}
