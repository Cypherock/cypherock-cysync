import {
  IAccount,
  IAccountDisplayInfo,
  IAccountRepository,
  IGetOptions,
} from '@cypherock/db-interfaces';

import { Repository } from './Repository';
import { ITableSchema } from './utils/types';

import { EncryptedDB } from '../encryptedDb';

export class AccountRepository
  extends Repository<IAccount>
  implements IAccountRepository
{
  // eslint-disable-next-line class-methods-use-this
  getDisplayAccounts(
    params: IGetOptions<IAccount>,
  ): Promise<IAccountDisplayInfo[]> {
    throw new Error(`Method not implemented. ${params}`);
  }

  public static async build<T extends IAccount>(
    encDb: EncryptedDB,
    name: string,
    schema: ITableSchema<T>,
  ) {
    return new AccountRepository(encDb, name, schema);
  }
}
