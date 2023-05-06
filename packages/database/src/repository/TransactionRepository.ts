import {
  ITransaction,
  ITransactionRepository,
  IGetOptions,
  IDetailedTransaction,
} from '@cypherock/db-interfaces';
import { BaseRepository } from './BaseRepository';
import { Transaction } from '../entity/Transaction';

export class TransactionRepository
  extends BaseRepository<Transaction>
  implements ITransactionRepository
{
  getTransactionList: (
    params: IGetOptions<ITransaction>,
  ) => Promise<IDetailedTransaction[]>;
}
