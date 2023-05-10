import {
  ITransaction,
  ITransactionRepository,
  IGetOptions,
  IDetailedTransaction,
} from '@cypherock/db-interfaces';
import { Repository } from './Repository';

export class TransactionRepository
  extends Repository<ITransaction>
  implements ITransactionRepository
{
  getTransactionList: (
    params: IGetOptions<ITransaction>,
  ) => Promise<IDetailedTransaction[]>;
}
