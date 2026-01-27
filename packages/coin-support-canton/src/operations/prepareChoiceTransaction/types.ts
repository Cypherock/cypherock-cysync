import {
  IDatabase,
  IKeyValueStore,
  ITransaction,
} from '@cypherock/db-interfaces';

import { ICantonTransactionChoice } from '../transaction';

export interface IPrepareCantonChoiceTransactionParams {
  db: IDatabase;
  txn: ITransaction;
  choice: ICantonTransactionChoice;
  keyDB: IKeyValueStore;
}
