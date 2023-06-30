import {
  ITransaction,
  ITransactionRepository,
  IGetOptions,
  IDetailedTransaction,
} from '@cypherock/db-interfaces';

import { Repository } from './Repository';
import { ITableSchema } from './utils/types';

import { EncryptedDB } from '../encryptedDb';

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

  public static async build<T extends ITransaction>(
    encDb: EncryptedDB,
    name: string,
    schema: ITableSchema<T>,
  ) {
    return new TransactionRepository(encDb, name, schema);
  }
}
