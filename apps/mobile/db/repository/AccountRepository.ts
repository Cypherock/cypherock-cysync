import {
  IAccount,
  IAccountRepository,
  IGetOptions,
  IAccountDisplayInfo,
} from '@cypherock/db-interfaces';
import Realm from 'realm';
import { Repository } from './Repository';

export class AccountRepository
  extends Repository<IAccount>
  implements IAccountRepository
{
  async getDisplayAccounts(
    params: IGetOptions<IAccount>,
  ): Promise<IAccountDisplayInfo[]> {
    // TODO: Implement this function
    return [];
  }

  public static async build(
    realm: Realm,
    name: string,
  ): Promise<AccountRepository> {
    return new AccountRepository(realm, name);
  }
}
