import {
  ITransaction,
  ITransactionRepository,
  IGetOptions,
  IDetailedTransaction,
} from '@cypherock/db-interfaces';
import { Repository } from './Repository';
import Realm from 'realm';

export class TransactionRepository
  extends Repository<ITransaction>
  implements ITransactionRepository
{
  // eslint-disable-next-line class-methods-use-this
  getTransactionList(
    params: IGetOptions<ITransaction>,
  ): Promise<IDetailedTransaction[]> {
    throw new Error(`Method not implemented. ${params}`);
  }

  public static async build(realm: Realm, name: string) {
    return new TransactionRepository(realm, name);
  }
}
